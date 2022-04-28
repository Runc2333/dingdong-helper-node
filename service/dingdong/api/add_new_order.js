// const tools = require('../../../utils/tools');

module.exports = async (token, cart, order, reserve_time) => {
    let { params, headers, user } = token;
    if (order.order.total_money < config.dingdong.minimal_order_money) {
        throw (`订单金额不满足最低要求: ${order.order.total_money} 元`);
    }
    let package_order = {
        "reserved_time_start": reserve_time.reserved_time_start,
        "reserved_time_end": reserve_time.reserved_time_end,
        "price": order.order.total_money,
        "freight_discount_money": order.order.freight_discount_money,
        "freight_money": order.order.freight_money,
        "note": "",
        "product_type": 1,
        "order_product_list_sign": cart.order_product_list_sign,
        "address_id": user.address_id,
        "pay_type": 24,
        "products": cart.new_order_product_list[0].products.map(v => {
            return {
                "id": v.id,
                "parent_id": v.parent_id,
                "count": v.count,
                "cart_id": v.cart_id,
                "price": v.price,
                "product_type": v.product_type,
                "is_booking": v.is_booking,
                "sizes": v.sizes,
            };
        }),
        "vip_money": "",
        "vip_buy_user_ticket_id": ""
    };
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/addNewOrder',
        data: {
            ...params,
            order: JSON.stringify(package_order),
            soon_arrival: 0,
            showMsg: false,
        },
        headers: headers,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        proxy: {
            host: '127.0.0.1',
            port: 8888
        }
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg || result.data.tips.limitMsg);
    }
};