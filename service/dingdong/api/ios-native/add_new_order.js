module.exports = async (session, cart, order, reserve_time) => {
    if (order.order.total_money < config.dingdong.minimal_order_money) {
        throw (`订单金额不满足最低要求: ${order.order.total_money} 元`);
    }
    let package_order = {
        "payment_order": {
            "parent_order_sign": cart.parent_order_info.parent_order_sign,
            "price": order.order.total_money,
            "pay_type": 2,
            "receipt_without_sku": "0",
            "order_freight": order.order.freights[0].freight.freight_real_money,
            "is_use_balance": "0",
            "address_id": session.user.address_id,
            "current_position": [session.params["latitude"], session.params["longitude"]],
        },
        "packages": [{
            "first_selected_big_time": "0",
            "products": cart.new_order_product_list[0].products.map(v => {
                return {
                    "price": v.price,
                    "batch_type": v.sale_batches.batch_type,
                    "order_sort": v.order_sort,
                    "cart_id": v.cart_id,
                    "parent_id": v.parent_id,
                    "count": v.count,
                    "id": v.id,
                };
            }),
            "reserved_time_end": reserve_time.reserved_time_end,
            "package_id": cart.new_order_product_list[0].package_id,
            "package_type": cart.new_order_product_list[0].package_type,
            "soon_arrival": "",
            "eta_trace_id": "",
            "reserved_time_start": reserve_time.reserved_time_start,
            "real_match_supply_order": false,
            "time_biz_type": 0,
        }]
    };
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/addNewOrder',
        data: {
            "ab_config": `{"key_no_condition_barter":false}`,
            "api_version": session.params["api_version"],
            "app_client_id": session.params["app_client_id"],
            "app_type": session.params["app_type"],
            "buildVersion": session.params["buildVersion"],
            "channel": session.params["channel"],
            "city_number": session.params["city_number"],
            "clientDetail": ``,
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
            "package_order": JSON.stringify(package_order),
            "seqid": session.params["seqid"],
            "station_id": session.params["station_id"],
            "time": session.params["time"],
            "uid": session.params["uid"],
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