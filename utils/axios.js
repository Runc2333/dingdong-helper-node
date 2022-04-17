const axios = require('axios');
const ddmc = require('../service/dingdong');
axios.interceptors.request.use(function (config) {
    if (config.method === 'get') {
        let { nars, sesi } = ddmc._sign(JSON.stringify(config.params) || '{}');
        if (!config.params) config.params = {};
        config.params.nars = nars;
        config.params.sesi = sesi;
    } else {
        let { nars, sesi } = ddmc._sign(JSON.stringify(config.data) || '{}');
        if (!config.data) config.data = {};
        config.data.nars = nars;
        config.data.sesi = sesi;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

module.exports = axios;