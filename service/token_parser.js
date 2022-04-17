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
        channel: query.channel,
        app_client_id: query.app_client_id,
        sharer_uid: query.sharer_uid,
        s_id: query.s_id,
        openid: query.openid,
        h5_source: query.h5_source,
        time: '',
        device_token: decodeURIComponent(query.device_token),
    }, {
        get (target, key) {
            if (key == 'time') {
                return Math.round(new Date().getTime() / 1000);
            }
            return target[key];
        },
    });

    const headers = new Proxy({
        'Content-Type': header.find(item => item.name == 'content-type').value,
        'ddmc-city-number': query.city_number,
        'ddmc-time': '',
        'ddmc-build-version': query.app_version,
        'ddmc-device-id': query.openid,
        'ddmc-station-id': query.station_id,
        'ddmc-channel': query.channel,
        'ddmc-os-version': header.find(item => item.name == 'ddmc-os-version').value,
        'ddmc-app-client-id': query.app_client_id,
        'cookie': header.find(item => item.name == 'cookie').value,
        'ddmc-ip': header.find(item => item.name == 'ddmc-ip').value,
        'ddmc-longitude': query.longitude,
        'ddmc-latitude': query.latitude,
        'ddmc-api-version': query.api_version,
        'ddmc-uid': query.uid,
        'accept-encoding': header.find(item => item.name == 'accept-encoding').value,
        'user-agent': header.find(item => item.name == 'user-agent').value,
        'referer': header.find(item => item.name == 'referer').value,
    }, {
        get (target, key) {
            if (key == 'ddmc-time') {
                return Math.round(new Date().getTime() / 1000);
            }
            return target[key];
        }
    });

    const user = {
        address_id: profile.address_id,
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