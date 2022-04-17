module.exports = async (token) => {
    let { params, headers } = token;
    let result = ((await axios({
        method: 'get',
        url: 'https://maicai.api.ddxq.mobi/homeApi/newCategories',
        params: params,
        headers: headers
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg);
    }
};