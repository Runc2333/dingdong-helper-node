const fs = require('fs');
const path = require('path');
const tools = require('../utils/tools');
const crypto = require('crypto');

const load_profile = (profile) => {
    let req_data;
    try {
        req_data = JSON.parse(fs.readFileSync(path.join(__dirname, '../charles_sessions', fs.readdirSync(path.join(__dirname, '../charles_sessions')).filter(v => /\.chlsj$/.test(v))[profile.seq]), 'utf8'));
    } catch (e) {
        logger.e(e);
        logger.e('请检查您的配置文件是否正确, charles_session 目录下是否存在 .chlsj（JSON Session File） 文件');
        process.exit(1);
    }

    const user = {
        address_id: '',
        group_config_id: '',
        im_secret: profile.im_secret,
    };

    const query = tools.parse_query(req_data[0].query);
    for (let key in query) {
        query[key] = decodeURIComponent(query[key]);
    }
    const params = new Proxy({
        "ab_config": query["ab_config"],
        "api_version": query["api_version"],
        "app_client_id": query["app_client_id"],
        "app_type": query["app_type"],
        "buildVersion": query["buildVersion"],
        "channel": query["channel"],
        "city_number": query["city_number"],
        "countryCode": query["countryCode"],
        "device_id": query["device_id"],
        "device_model": query["device_model"],
        "device_name": query["device_name"],
        "device_token": query["device_token"],
        "idfa": query["idfa"],
        "ip": query["ip"],
        "is_filter": query["is_filter"],
        "is_load": query["is_load"],
        "languageCode": query["languageCode"],
        "latitude": query["latitude"],
        "localeIdentifier": query["localeIdentifier"],
        "longitude": query["longitude"],
        "os_version": query["os_version"],
        "seqid": query["seqid"],
        "sign": query["sign"],
        "station_id": query["station_id"],
        "time": query["time"],
        "uid": query["uid"],
    }, {
        get (target, key) {
            if (key == 'time') {
                return Math.round(new Date().getTime() / 1000);
            }
            if (target[key] !== undefined) {
                return target[key];
            } else {
                if (typeof key !== "symbol") {
                    logger.d(`尝试获取不存在的 Param: ${key}`);
                }
                return '';
            }
        },
    });

    const header = req_data[0].request.header.headers.map(v => {
        return {
            name: decodeURIComponent(v.name),
            value: decodeURIComponent(v.value),
        };
    });
    const headers = new Proxy({
        "ddmc-city-number": header.find(item => item.name.toLowerCase() == "ddmc-city-number").value,
        "ddmc-locale-identifier": header.find(item => item.name.toLowerCase() == "ddmc-locale-identifier").value,
        "user-agent": header.find(item => item.name.toLowerCase() == "user-agent").value,
        "ddmc-device-token": header.find(item => item.name.toLowerCase() == "ddmc-device-token").value,
        "cookie": header.find(item => item.name.toLowerCase() == "cookie").value,
        "ddmc-api-version": header.find(item => item.name.toLowerCase() == "ddmc-api-version").value,
        "ddmc-build-version": header.find(item => item.name.toLowerCase() == "ddmc-build-version").value,
        "ddmc-idfa": header.find(item => item.name.toLowerCase() == "ddmc-idfa").value,
        "ddmc-longitude": header.find(item => item.name.toLowerCase() == "ddmc-longitude").value,
        "ddmc-latitude": header.find(item => item.name.toLowerCase() == "ddmc-latitude").value,
        "ddmc-app-client-id": header.find(item => item.name.toLowerCase() == "ddmc-app-client-id").value,
        "ddmc-device-name": header.find(item => item.name.toLowerCase() == "ddmc-device-name").value,
        "ddmc-uid": header.find(item => item.name.toLowerCase() == "ddmc-uid").value,
        "accept-language": header.find(item => item.name.toLowerCase() == "accept-language").value,
        "ddmc-device-model": header.find(item => item.name.toLowerCase() == "ddmc-device-model").value,
        "ddmc-channel": header.find(item => item.name.toLowerCase() == "ddmc-channel").value,
        "ddmc-country-code": header.find(item => item.name.toLowerCase() == "ddmc-country-code").value,
        "ddmc-device-id": header.find(item => item.name.toLowerCase() == "ddmc-device-id").value,
        "ddmc-ip": header.find(item => item.name.toLowerCase() == "ddmc-ip").value,
        "ddmc-station-id": header.find(item => item.name.toLowerCase() == "ddmc-station-id").value,
        "ddmc-language-code": header.find(item => item.name.toLowerCase() == "ddmc-language-code").value,
        "accept": header.find(item => item.name.toLowerCase() == "accept").value,
        "accept-encoding": header.find(item => item.name.toLowerCase() == "accept-encoding").value,
        "ddmc-os-version": header.find(item => item.name.toLowerCase() == "ddmc-os-version").value,
        im_secret: profile.im_secret,
    }, {
        get (target, key) {
            if (key == 'time') {
                let time = Math.round(new Date().getTime() / 1000);
                return `${time},${crypto.createHash('md5').update(`private_key=${user.im_secret}&time=${time}`).digest('hex')}`;
            }
            if (target[key] !== undefined) {
                return target[key];
            } else {
                if (typeof key !== "symbol") {
                    logger.d(`尝试获取不存在的 Header: ${key}`);
                }
                return '';
            }
        }
    });

    return {
        params,
        headers,
        user,
    };
};


module.exports = {
    load_profile
};