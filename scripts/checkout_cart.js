require('../config/config');
require('../utils/autoloader');

const path = require('path');
const player = require('sound-play');

const ddmc = require('../service/dingdong');
const webhook = require('../service/webhook');
const { load_profile } = require('../service/session_parser');
const { EventEmitter } = require('events');

let speedcheck = process.argv[2] === 'speedcheck';

const get_address = async (token) => {
    let address;
    while (!address) {
        try {
            address = await ddmc.get_address(token);
        } catch (e) {
            address = undefined;
            logger.e(`获取地址列表失败: ${e}`);
            if (/您的访问已过期/.test(e)) process.exit(1);
            if (!speedcheck) await tools.sleep(tools.rand_between(config.dingdong.submit_interval_min, config.dingdong.submit_interval_max));
        }
    }
    return address;
};

const get_cart = async (token) => {
    let cart;
    while (!cart) {
        try {
            await ddmc.cart_check_all(token);
            cart = await ddmc.get_cart(token);
            if (cart.new_order_product_list.length > 0) {
                logger.i(`购物车商品更新: 共 ${cart.new_order_product_list[0].total_count} 件`);
            } else {
                throw ('购物车无有货商品');
            }
        } catch (e) {
            cart = undefined;
            logger.e(`获取购物车内容失败: ${e}`);
            if (e.stack) logger.d(e.stack);
            if (!speedcheck) await tools.sleep(tools.rand_between(config.dingdong.submit_interval_min, config.dingdong.submit_interval_max));
        }
    }
    return cart;
};

const get_reserve_time = async (token, cart) => {
    let reserve_time;
    while (!reserve_time) {
        try {
            let resp = await ddmc.get_multi_reserve_time(token, cart);
            for (let time of resp[0].time[0].times) {
                if (!time.fullFlag && !time.arrival_time_msg.includes('尽快')) {
                    reserve_time = {
                        reserved_time_start: time.start_timestamp,
                        reserved_time_end: time.end_timestamp,
                        time_text: time.arrival_time_msg,
                    };
                    break;
                }
            }
            if (!reserve_time) {
                throw ('没有可预约的时间');
            }
        } catch (e) {
            reserve_time = undefined;
            logger.e(`获取预约时间失败: ${e}`);
            if (e.stack) logger.d(e.stack);
            if (!speedcheck) await tools.sleep(tools.rand_between(config.dingdong.submit_interval_min, config.dingdong.submit_interval_max));
        }
    }
    logger.i(`预约时间更新: ${reserve_time.time_text}`);
    return reserve_time;
};

const check_order = async (token, cart, reserve_time) => {
    let order;
    while (!order) {
        try {
            order = await ddmc.check_order(token, cart, reserve_time);
        } catch (e) {
            order = undefined;
            logger.e(`获取订单失败: ${e}`);
            if (e && e.stack) logger.e(e.stack);
            if (String(e).trim().length === 0) continue;
            if (!speedcheck) await tools.sleep(100);
        }
    }
    logger.i(`订单信息更新: 总计: ${order.order.total_money} 元`);
    return order;
};

(async () => {
    if (speedcheck) {
        if (config.dingdong.thread_count === undefined) {
            logger.w(`未设置提交订单并发数，请检查您的配置文件。本次运行将使用默认值: 2`);
        } else {
            logger.i(`当前提交订单并发数: ${config.dingdong.thread_count}`);
        }
        if (config.dingdong.thread_interval === undefined) {
            logger.w(`未设置线程创建延迟，请检查您的配置文件。本次运行将使用默认值: 100 ms`);
        } else {
            logger.i(`当前线程创建延迟: ${config.dingdong.thread_interval} ms`);
        }
    }
    for (let profile of config.dingdong.profiles) {
        (async () => {
            let session = load_profile(profile);
            // Rewrite station id and address id as default address
            let address = await get_address(session);
            let default_address = address.valid_address.find((addr) => {
                return addr.is_default;
            });
            if (!default_address) {
                logger.e(`[${profile.alias}] 没有设置默认地址，请先设置`);
                process.exit(1);
            }
            let [longitude, latitude] = default_address.location.location;
            session.params.station_id = default_address.station_id;
            session.params.city_number = default_address.city_number;
            session.params.longitude = longitude;
            session.params.latitude = latitude;
            session.headers["ddmc-station-id"] = default_address.station_id;
            session.headers["ddmc-city-number"] = default_address.city_number;
            session.headers["ddmc-longitude"] = longitude;
            session.headers["ddmc-latitude"] = latitude;
            session.user.address_id = default_address.id;
            logger.i(`[${profile.alias}] 当前默认地址 : ${default_address.location.address}`);
            // Tring to make order
            let cart = await get_cart(session);
            let reserve_time = await get_reserve_time(session, cart);
            let order = await check_order(session, cart, reserve_time);
            let success = false;
            let promise_list = [];
            let thread_count = speedcheck ? (config.dingdong.thread_count || 2) : 1;
            let thread_interval = speedcheck ? (config.dingdong.thread_interval || 100) : 100;
            let emitter = new EventEmitter();
            const submit_order = async () => {
                let local_success = false;
                // Refresh flags to avoid duplicate refresh
                let reserve_time_already_refreshed = false;
                emitter.on('reserve_time_refresh', () => { reserve_time_already_refreshed = true; });
                let cart_already_refreshed = false;
                emitter.on('cart_refresh', () => { cart_already_refreshed = true; });
                while (!success) {
                    logger.i(`[${profile.alias}] 尝试下单 ${cart.new_order_product_list[0].total_count} 件商品 总计: ${order.order.total_money} 元 送达时间: ${reserve_time.time_text}`);
                    try {
                        await ddmc.add_new_order(session, cart, order, reserve_time);
                        success = true;
                        local_success = true;
                    } catch (e) {
                        logger.e(`[${profile.alias}] 下单失败: ${e}`);
                        if (String(e).includes('时') && !reserve_time_already_refreshed) {
                            // Reserve time changed, refresh
                            reserve_time = await get_reserve_time(session, cart);
                            order = await check_order(session, cart, reserve_time);
                            emitter.emit('reserve_time_refresh');
                        }
                        if ((String(e).includes('售罄') || String(e).includes('缺货') || String(e).includes('暂未营业') || String(e).includes('订单金额不满足最低要求')) && !cart_already_refreshed) {
                            // Cart changed, refresh
                            await ddmc.cart_check_all(session);
                            cart = await get_cart(session);
                            order = await check_order(session, cart, reserve_time);
                            emitter.emit('cart_refresh');
                        }
                        // Reset refresh flag
                        reserve_time_already_refreshed = false;
                        cart_already_refreshed = false;
                    }
                    // Success logic
                    if (local_success) {
                        // Send notification to webhook
                        try {
                            if (config.dingdong.webhook_url) {
                                await webhook({ profile, cart, order, reserve_time });
                                logger.i(`[${profile.alias}] 已调用 webhook 方法`);
                            }
                        } catch (e) {
                            logger.e(`[${profile.alias}] 调用 Webhook 方法时出现错误: ${e}`);
                            logger.e(`[${profile.alias}] 请检查您的 webhook_url 是否正确, /service/webhook.js 是否编写正确, 接口状态是否正常`);
                            if (e.stack) logger.d(e.stack);
                        }
                        // Play notification sound
                        try {
                            player.play(path.join(__dirname, '..', 'assets', "success.mp3"), 1);
                        } catch (e) {
                            logger.e(`播放提示音失败: ${e}`);
                            if (e.stack) logger.d(e.stack);
                        }
                        logger.i(`[${profile.alias}] 下单成功`);
                        if (!speedcheck) {
                            // Loop when in normal mode
                            success = false; // Reset success flag
                            // Refresh cart and reserve time
                            cart = await get_cart(session);
                            reserve_time = await get_reserve_time(session, cart);
                            order = await check_order(session, cart, reserve_time);
                            continue; // Continue loop
                        }
                    }
                    if (!speedcheck) await tools.sleep(200);
                }
            };
            // Create threads
            for (let i = 0; i < thread_count; i++) {
                promise_list.push(submit_order());
                await tools.sleep(thread_interval);
            }
            await Promise.all(promise_list);
        })();
        if (!speedcheck) await tools.sleep(1000);
    }
})();