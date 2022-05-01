module.exports = async (session, cart) => {
    let products = JSON.stringify(cart.new_order_product_list[0].products.map(product => {
        return {
            "sale_batches": {
                "batch_type": product.sale_batches ? product.sale_batches.batch_type : 0,
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
    })).replace(/"/g, '\\"');
    let data = {
        "ab_config": `{"ETA_time_default_selection":"C1.1"}`,
        "api_version": session.params["api_version"],
        "app_client_id": session.params["app_client_id"],
        "app_type": session.params["app_type"],
        "buildVersion": session.params["buildVersion"],
        "channel": session.params["channel"],
        "city_number": session.params["city_number"],
        "countryCode": session.params["countryCode"],
        "device_id": session.params["device_id"],
        "device_model": session.params["device_model"],
        "device_name": session.params["device_name"],
        "device_token": session.params["device_token"],
        "idfa": session.params["idfa"],
        "ip": session.params["ip"],
        "languageCode": session.params["languageCode"],
        "latitude": session.params["latitude"],
        "localeIdentifier": session.params["localeIdentifier"],
        "longitude": session.params["longitude"],
        "os_version": session.params["os_version"],
        "seqid": session.params["seqid"],
        "station_id": session.params["station_id"],
        "time": session.params["time"],
        "uid": session.params["uid"],
        "address_id": session.user.address_id,
        "products": `["${products}"]`,
    };
    let data_keys = Object.keys(data).sort();
    let data_sorted = {};
    for (let key of data_keys) {
        data_sorted[key] = data[key];
    }
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/getMultiReserveTime',
        data: data_sorted,
        headers: {
            "accept": session.headers["accept"],
            "accept-encoding": session.headers["accept-encoding"],
            "accept-language": session.headers["accept-language"],
            "content-type": "application/x-www-form-urlencoded",
            "cookie": session.headers["cookie"],
            "ddmc-api-version": session.headers["ddmc-api-version"],
            "ddmc-app-client-id": session.headers["ddmc-app-client-id"],
            "ddmc-build-version": session.headers["ddmc-build-version"],
            "ddmc-channel": session.headers["ddmc-channel"],
            "ddmc-city-number": session.headers["ddmc-city-number"],
            "ddmc-country-code": session.headers["ddmc-country-code"],
            "ddmc-device-id": session.headers["ddmc-device-id"],
            "ddmc-device-model": session.headers["ddmc-device-model"],
            "ddmc-device-name": session.headers["ddmc-device-name"],
            "ddmc-device-token": session.headers["ddmc-device-token"],
            "ddmc-idfa": session.headers["ddmc-idfa"],
            "ddmc-ip": session.headers["ddmc-ip"],
            "ddmc-language-code": session.headers["ddmc-language-code"],
            "ddmc-latitude": session.headers["ddmc-latitude"],
            "ddmc-locale-identifier": session.headers["ddmc-locale-identifier"],
            "ddmc-longitude": session.headers["ddmc-longitude"],
            "ddmc-os-version": session.headers["ddmc-os-version"],
            "ddmc-station-id": session.headers["ddmc-station-id"],
            "ddmc-uid": session.headers["ddmc-uid"],
            "time": session.headers["time"],
            "user-agent": session.headers["user-agent"],
            "im_secret": session.user["im_secret"],
        },
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