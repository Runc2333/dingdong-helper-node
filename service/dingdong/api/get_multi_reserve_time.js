module.exports = async (token, cart) => {
    let { params, headers, user } = token;
    // console.log(JSON.stringify({
    //     ...params,
    //     address_id: user.address_id,
    //     products: JSON.stringify(cart.new_order_product_list[0].products),
    // }));
    // throw '';
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/getReserveTime',
        data: {
            ...params,
            address_id: user.address_id,
            products: JSON.stringify(cart.new_order_product_list[0].products),
        },
        headers: headers,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }]
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg || result.data.message);
    }
};