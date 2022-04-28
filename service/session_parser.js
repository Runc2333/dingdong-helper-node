const fs = require('fs');
const path = require('path');
const tools = require('../utils/tools');

const load_profile = (profile) => {
    let req_data;
    try {
        req_data = JSON.parse(fs.readFileSync(path.join(__dirname, '../charles_sessions', fs.readdirSync(path.join(__dirname, '../charles_sessions'))[profile.seq]), 'utf8'));
    } catch (e) {
        logger.e(e);
        process.exit(1);
    }

    const query = tools.parse_query(req_data[0].query);
    const header = req_data[0].request.header.headers;

    const params = new Proxy({
        uid: query.uid,
        longitude: query.longitude,
        latitude: query.latitude,
        station_id: query.station_id,
        city_number: query.city_number,
        api_version: query.api_version,
        app_version: query.app_version,
        applet_source: query.applet_source,
        app_client_id: query.app_client_id,
        h5_source: query.h5_source,
        sharer_uid: query.sharer_uid,
        s_id: query.s_id,
        openid: query.openid,
    }, {
        get (target, key) {
            if (key == 'time') {
                return Math.round(new Date().getTime() / 1000);
            }
            return target[key];
        },
    });

    const headers = new Proxy({
        "ddmc-city-number": header.find(item => item.name == 'ddmc-city-number').value,
        "referer": header.find(item => item.name == 'referer').value,
        "cookie": header.find(item => item.name == 'cookie').value,
        "user-agent": header.find(item => item.name == 'user-agent').value,
        "ddmc-api-version": header.find(item => item.name == 'ddmc-api-version').value,
        "origin": header.find(item => item.name == 'origin').value,
        "ddmc-build-version": header.find(item => item.name == 'ddmc-build-version').value,
        "ddmc-longitude": header.find(item => item.name == 'ddmc-longitude').value,
        "ddmc-latitude": header.find(item => item.name == 'ddmc-latitude').value,
        "ddmc-app-client-id": header.find(item => item.name == 'ddmc-app-client-id').value,
        "ddmc-uid": header.find(item => item.name == 'ddmc-uid').value,
        "accept-language": header.find(item => item.name == 'accept-language').value,
        "ddmc-channel": header.find(item => item.name == 'ddmc-channel').value,
        "ddmc-device-id": header.find(item => item.name == 'ddmc-device-id').value,
        "accept": header.find(item => item.name == 'accept').value,
        "content-type": header.find(item => item.name == 'content-type').value,
        "ddmc-station-id": header.find(item => item.name == 'ddmc-station-id').value,
        "accept-encoding": header.find(item => item.name == 'accept-encoding').value,
        "ddmc-ip": header.find(item => item.name == 'ddmc-ip').value,
        "ddmc-os-version": header.find(item => item.name == 'ddmc-os-version').value
    }, {
        get (target, key) {
            if (key == 'ddmc-time') {
                return Math.round(new Date().getTime() / 1000);
            }
            return target[key];
        }
    });

    const user = {
        address_id: '',
        group_config_id: '',
    };

    return {
        params,
        headers,
        user,
    };
};


module.exports = {
    load_profile
};