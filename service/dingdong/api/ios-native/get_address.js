module.exports = async (session) => {
    let { params } = session;
    let result = ((await axios({
        method: 'get',
        url: 'https://sunquan.api.ddxq.mobi/api/v1/user/address/',
        params: {
            ...params,
            source_type: 5,
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
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg || result.data.message);
    }
};