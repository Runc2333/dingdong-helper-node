module.exports = async (session, cart) => {
    let products = cart.new_order_product_list[0].products.map(v => {
        return {
            "id": v.id,
            "is_booking": v.is_booking,
            "total_money": v.total_price,
            "is_invoice": v.is_invoice ? true : false,
            "total_origin_money": v.total_origin_price,
            "category_path": v.category_path,
            "count": v.count,
            "type": v.type,
            "batch_type": v.sale_batches ? v.sale_batches.batch_type : 0,
            "is_coupon_gift": v.is_gift,
            "price": v.price,
            "order_sort": String(v.order_sort),
            "instant_rebate_money": v.instant_rebate_money,
            "activity_id": v.activity_id,
            "conditions_num": v.conditions_num,
            "price_type": String(v.price_type),
            "product_type": v.product_type,
            "origin_price": v.origin_price
        };
    });
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/checkOrder',
        data: {
            "ab_config": `{"ETA_time_default_selection":"C1.1"}`,
            "api_version": session.params["api_version"],
            "app_client_id": session.params["app_client_id"],
            "app_type": session.params["app_type"],
            "buildVersion": session.params["buildVersion"],
            "channel": session.params["channel"],
            "city_number": session.params["city_number"],
            "countryCode": session.params["countryCode"],
            "coupons_id": "",
            "device_id": session.params["device_id"],
            "device_model": session.params["device_model"],
            "device_name": session.params["device_name"],
            "device_token": session.params["device_token"],
            "freight_ticket_id": 'default',
            "idfa": session.params["idfa"],
            "ip": session.params["ip"],
            "is_buy_coupons": 0,
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
            "user_ticket_id": 'default',
            "is_use_point": 0,
            "is_use_balance": 0,
            "is_buy_vip": 0,
            "packages": JSON.stringify([{
                "reserved_time": {
                    "time_biz_type": 0,
                },
                "real_match_supply_order": cart.new_order_product_list[0].is_supply_order,
                "is_supply_order": cart.new_order_product_list[0].is_supply_order,
                "package_type": cart.new_order_product_list[0].package_type,
                "package_id": cart.new_order_product_list[0].package_id,
                "products": products,
            }]),
            "check_order_type": 0,
        },
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
        }],
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg || result.data.message || result.data.tips.limitMsg);
    }
};