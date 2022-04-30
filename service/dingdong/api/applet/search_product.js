module.exports = async (token, keyword) => {
    let { params, headers } = token;
    let result = ((await axios({
        method: 'get',
        url: 'https://maicai.api.ddxq.mobi/search/searchProduct',
        params: {
            ...params,
            keyword: keyword,
            tag: '',
            page: 1,
            sort: 0,
            guide_id: '',
            select_activity_id: '',
            count: 12,
            like_size: 30
        },
        headers: headers
    })));

    if (result.data.success) {
        return result.data.data.product_list;
    } else {
        throw (result.data.msg || result.data.message);
    }
};