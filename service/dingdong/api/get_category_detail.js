module.exports = async (token, category_id) => {
    let { params, headers } = token;
    let result = ((await axios({
        method: 'get',
        url: 'https://maicai.api.ddxq.mobi/homeApi/categoriesNewDetail',
        params: {
            ...params,
            'version_control': 'new',
            category_id: category_id,
        },
        headers: headers,
        transformRequest: [(_data, headers) => {
            // Delete default headers
            delete headers.common['Accept'];
            delete headers['Content-Type'];
            headers['content-type'] = 'application/x-www-form-urlencoded';
            return _data;
        }],
        proxy: {
            host: '127.0.0.1',
            port: 8888,
        }
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg || result.data.message);
    }
};