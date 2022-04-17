module.exports = async (token) => {
    let { params, headers } = token;
    let result = ((await axios({
        method: 'get',
        url: 'https://maicai.api.ddxq.mobi/cart/index',
        params: {
            ...params,
            is_load: 1,
            ab_coinfig: JSON.stringify({
                "key_onion": "D",
                "key_cart_discount_price": "C"
            }),
        },
        headers: headers,
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg);
    }
};