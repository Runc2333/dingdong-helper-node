module.exports = async (token, id) => {
    let { params, headers } = token;
    if (!(id instanceof Array)) id = [id];
    let cart = id.map(v => {
        return {
            "id": v,
            "count": 1,
            "activity_id": "",
            "vip_activity_id": "",
            "mandatory_check": "1",
            "mandatory_count": 0,
            "batch_type": -1,
            "algo_info": {},
            "sizes": []
        };
    });
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/cart/add',
        data: {
            ...params,
            products: JSON.stringify(cart),
            is_filter: 1,
            activity_id: "",
            vip_activity_id: "",
            is_load: 1,
            add_scene: 0,
            showData: true,
            is_force_gift_coupon: 0,
            pageid: '',
            cid: '',
            vip_page: 0,
            is_guide_goods_onion: 0,
            filter_stock: 0,
            showMsg: false,
            ab_coinfig: JSON.stringify({
                "key_onion": "C"
            }),
        },
        headers: headers,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        // proxy: {
        //     host: '127.0.0.1',
        //     port: 8888
        // }
    })));

    if (result.data.success) {
        return result.data.data;
    } else {
        throw (result.data.msg);
    }
};