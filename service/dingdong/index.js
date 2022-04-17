const fs = require('fs');
const path = require('path');

let api = {};
for (let file of fs.readdirSync(path.join(__dirname, 'api'))) {
    if (file.endsWith('.js')) {
        let name = file.replace('.js', '');
        api[name] = require(`./api/${name}`);
    }
}

api._gen_category_array = async (token) => {
    let category_array = [];
    let raw_result = await api.get_category_list(token);
    for (let item of raw_result.cate) {
        category_array.push(
            ...item.cate
                .map(cate => {
                    cate.parent = {
                        id: item.id,
                        name: item.name,
                        role: item.role,
                        category_image_url: item.category_image_url,
                    };
                    return cate;
                })
        );
    }
    return category_array;
};

api._cache_all_goods = async (token) => {
    let all_cates = await api._gen_category_array(token);
    let all_goods = [];
    for (let cate_index in all_cates) {
        let cate = all_cates[cate_index];
        let cate_detail = await api.get_category_detail(token, cate.id);
        if (cate_detail.cate) {
            for (let item of cate_detail.cate) {
                all_goods.push(...item.products);
            }
        }
        all_goods.push(...cate_detail.products);
        logger.d(`Caching ${cate_index}/${all_cates.length}`);
    }
    fs.writeFileSync(path.join(__dirname, 'cache', 'all_goods.json'), JSON.stringify(all_goods));
    return all_goods;
};

api._filter_available_goods = (goods) => {
    return goods.filter((v) => {
        return v.stock_number > 0;
    });
};

Object.freeze(api);

module.exports = api;