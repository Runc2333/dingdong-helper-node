module.exports = async (token) => {
    let { params, headers } = token;
    let result = ((await axios({
        method: 'get',
        url: 'https://sunquan.api.ddxq.mobi/api/v1/user/address/',
        params: {
            ...params,
            source_type: 5,
        },
        headers: headers,
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg);
    }
};