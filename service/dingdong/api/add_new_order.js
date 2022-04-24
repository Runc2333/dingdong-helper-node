const tools = require('../../../utils/tools');

module.exports = async (token, cart, order, reserve_time) => {
    let { params, headers, user } = token;
    if (order.order.total_money < config.dingdong.minimal_order_money) {
        throw (`订单金额不满足最低要求: ${order.order.total_money} 元`);
    }
    let package_order = {
        "payment_order": {
            "reserved_time_start": reserve_time.reserved_time_start,
            "reserved_time_end": reserve_time.reserved_time_end,
            "price": order.order.total_money,
            "freight_discount_money": order.order.freights[0].freight.discount_freight_money,
            "freight_money": order.order.freights[0].freight.freight_money,
            "order_freight": order.order.freights[0].freight.freight_real_money,
            "parent_order_sign": cart.parent_order_info.parent_order_sign,
            "product_type": 1,
            "address_id": user.address_id,
            "form_id": tools.random_string(32).toLowerCase(),
            "receipt_without_sku": null,
            "pay_type": 6,
            "user_ticket_id": order.order.default_coupon._id,
            "vip_money": "",
            "vip_buy_user_ticket_id": "",
            "coupons_money": "",
            "coupons_id": ""
        },
        "packages": [{
            "products": cart.new_order_product_list[0].products.map(v => {
                return {
                    "id": v.id,
                    "parent_id": v.parent_id,
                    "count": v.count,
                    "cart_id": v.cart_id,
                    "price": v.price,
                    "product_type": v.product_type,
                    "is_booking": v.is_booking,
                    "product_name": v.product_name,
                    "small_image": v.small_image,
                    "sale_batches": v.sale_batches,
                    "order_sort": v.order_sort,
                    "sizes": v.sizes,
                };
            }),
            "total_money": cart.new_order_product_list[0].total_money,
            "total_origin_money": cart.new_order_product_list[0].total_origin_money,
            "goods_real_money": cart.new_order_product_list[0].goods_real_money,
            "total_count": cart.new_order_product_list[0].total_count,
            "cart_count": cart.new_order_product_list[0].cart_count,
            "is_presale": cart.new_order_product_list[0].is_presale,
            "instant_rebate_money": cart.new_order_product_list[0].instant_rebate_money,
            "coupon_rebate_money": cart.new_order_product_list[0].coupon_rebate_money,
            "total_rebate_money": cart.new_order_product_list[0].total_rebate_money,
            "used_balance_money": cart.new_order_product_list[0].used_balance_money,
            "can_used_balance_money": cart.new_order_product_list[0].can_used_balance_money,
            "used_point_num": cart.new_order_product_list[0].used_point_num,
            "used_point_money": cart.new_order_product_list[0].used_point_money,
            "can_used_point_num": cart.new_order_product_list[0].can_used_point_num,
            "can_used_point_money": cart.new_order_product_list[0].can_used_point_money,
            "is_share_station": cart.new_order_product_list[0].is_share_station,
            "only_today_products": cart.new_order_product_list[0].only_today_products,
            "only_tomorrow_products": cart.new_order_product_list[0].only_tomorrow_products,
            "package_type": cart.new_order_product_list[0].package_type,
            "package_id": cart.new_order_product_list[0].package_id,
            "front_package_text": cart.new_order_product_list[0].front_package_text,
            "front_package_type": cart.new_order_product_list[0].front_package_type,
            "front_package_stock_color": cart.new_order_product_list[0].front_package_stock_color,
            "front_package_bg_color": cart.new_order_product_list[0].front_package_bg_color,
            "eta_trace_id": "",
            "reserved_time_start": reserve_time.reserved_time_start,
            "reserved_time_end": reserve_time.reserved_time_end,
            "soon_arrival": "",
            "first_selected_big_time": 1
        }]
    };
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/addNewOrder',
        data: {
            ...params,
            package_order: JSON.stringify(package_order),
            showMsg: false,
            showData: true,
            ab_coinfig: JSON.stringify({
                "key_onion": "C"
            }),
        },
        headers: headers,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        // proxy: {
        //     host: '127.0.0.1',
        //     port: 8888
        // }
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg || result.data.tips.limitMsg);
    }
};