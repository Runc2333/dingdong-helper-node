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

    let query;
    try {
        query = tools.parse_query(req_data[0].query);
    } catch (e) {
        logger.e(e);
        logger.e('请检查您的配置文件是否正确, charles_session 目录下是否存在 .chlsj（JSON Session File） 文件');
        process.exit(1);
    }
    for (let key in query) {
        query[key] = decodeURIComponent(query[key]);
    }
    const query_locator = (name) => {
        if (query[name] !== undefined) {
            return query[name];
        }
        logger.w(`[${profile.alias}] 未能从 session 文件提取需要的 query: ${name}, 已返回空字符串`);
        logger.w(`[${profile.alias}] 请检查您导出的 session 文件是否正确`);
        logger.w(`[${profile.alias}] 如可正常运行，请忽略`);
        return '';
    };
    const params = new Proxy({
        "ab_config": query_locator("ab_config"),
        "api_version": query_locator("api_version"),
        "app_client_id": query_locator("app_client_id"),
        "app_type": query_locator("app_type"),
        "buildVersion": query_locator("buildVersion"),
        "channel": query_locator("channel"),
        "city_number": query_locator("city_number"),
        "countryCode": query_locator("countryCode"),
        "device_id": query_locator("device_id"),
        "device_model": query_locator("device_model"),
        "device_name": query_locator("device_name"),
        "device_token": query_locator("device_token"),
        "idfa": query_locator("idfa"),
        "ip": query_locator("ip"),
        "is_filter": query_locator("is_filter"),
        "is_load": query_locator("is_load"),
        "languageCode": query_locator("languageCode"),
        "latitude": query_locator("latitude"),
        "localeIdentifier": query_locator("localeIdentifier"),
        "longitude": query_locator("longitude"),
        "os_version": query_locator("os_version"),
        "seqid": query_locator("seqid"),
        "sign": query_locator("sign"),
        "station_id": query_locator("station_id"),
        "time": query_locator("time"),
        "uid": query_locator("uid"),
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

    let header;
    try {
        header = req_data[0].request.header.headers.map(v => {
            return {
                name: decodeURIComponent(v.name),
                value: decodeURIComponent(v.value),
            };
        });
    } catch (e) {
        logger.e(e);
        logger.e('请检查您的配置文件是否正确, charles_session 目录下是否存在 .chlsj（JSON Session File） 文件');
        process.exit(1);
    }
    const header_locator = (name) => {
        let target = header.find(item => item.name.toLowerCase() == name.toLowerCase());
        if (target) return target.value;
        logger.w(`[${profile.alias}] 未能从 session 文件提取需要的 header: ${name}, 已返回空字符串`);
        logger.w(`[${profile.alias}] 请检查您导出的 session 文件是否正确`);
        logger.w(`[${profile.alias}] 如可正常运行，请忽略`);
        return '';
    };
    const headers = new Proxy({
        "ddmc-city-number": header_locator("ddmc-city-number"),
        "ddmc-locale-identifier": header_locator("ddmc-locale-identifier"),
        "user-agent": header_locator("user-agent"),
        "ddmc-device-token": header_locator("ddmc-device-token"),
        "cookie": header_locator("cookie"),
        "ddmc-api-version": header_locator("ddmc-api-version"),
        "ddmc-build-version": header_locator("ddmc-build-version"),
        "ddmc-idfa": header_locator("ddmc-idfa"),
        "ddmc-longitude": header_locator("ddmc-longitude"),
        "ddmc-latitude": header_locator("ddmc-latitude"),
        "ddmc-app-client-id": header_locator("ddmc-app-client-id"),
        "ddmc-device-name": header_locator("ddmc-device-name"),
        "ddmc-uid": header_locator("ddmc-uid"),
        "accept-language": header_locator("accept-language"),
        "ddmc-device-model": header_locator("ddmc-device-model"),
        "ddmc-channel": header_locator("ddmc-channel"),
        "ddmc-country-code": header_locator("ddmc-country-code"),
        "ddmc-device-id": header_locator("ddmc-device-id"),
        "ddmc-ip": header_locator("ddmc-ip"),
        "ddmc-station-id": header_locator("ddmc-station-id"),
        "ddmc-language-code": header_locator("ddmc-language-code"),
        "accept": header_locator("accept"),
        "accept-encoding": header_locator("accept-encoding"),
        "ddmc-os-version": header_locator("ddmc-os-version"),
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