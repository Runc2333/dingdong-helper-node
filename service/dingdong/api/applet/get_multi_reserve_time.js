module.exports = async (token, cart) => {
    let { params, headers, user } = token;
    let products = [JSON.stringify(cart.new_order_product_list[0].products.map(product => {
        return {
            "sale_batches": {
                "batch_type": product.sale_batches.batch_type
            },
            "is_coupon_gift": 0,
            "id": product.id,
            "price": product.price,
            "is_booking": product.is_booking,
            "count": product.count,
            "small_image": product.small_image,
            "type": product.type,
            "origin_price": product.origin_price,
            "product_type": product.product_type,
            "product_name": product.product_name,
        };
    }))];
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/getMultiReserveTime',
        data: {
            ...params,
            address_id: user.address_id,
            products: products,
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