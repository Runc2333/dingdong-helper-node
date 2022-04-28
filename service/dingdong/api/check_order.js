module.exports = async (token, cart) => {
    let { params, headers, user } = token;
    let products = cart.new_order_product_list[0].products.map(v => {
        return {
            "id": v.id,
            "category_path": cart.product.effective[0].products.find(v => v.id === v.id).category_path || '',
            "count": v.count,
            "price": v.price,
            "total_money": v.total_price,
            "instant_rebate_money": v.instant_rebate_money,
            "activity_id": v.activity_id,
            "conditions_num": v.conditions_num,
            "product_type": v.product_type,
            "type": v.type,
        };
    });
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/checkOrder',
        data: {
            ...params,
            address_id: user.address_id,
            user_ticket_id: 'default',
            is_use_point: 0,
            is_use_balance: 0,
            is_buy_vip: 0,
            products: JSON.stringify(products),
            check_order_type: 0,
            showData: true,
        },
        headers: headers,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg);
    }
};