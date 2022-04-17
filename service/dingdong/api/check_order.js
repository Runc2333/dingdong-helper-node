module.exports = async (token, cart, reserve_time) => {
    let { params, headers, user } = token;
    let packages = [
        {
            "products": cart.new_order_product_list[0].products.map(v => {
                return {
                    "id": v.id,
                    "category_path": (cart.product.effective[0].products.find(v => v.id === v.id).category_path || cart.product.invalid[0].products.find(v => v.id === v.id).category_path) || '',
                    "count": v.count,
                    "price": v.price,
                    "total_money": v.total_price,
                    "instant_rebate_money": v.instant_rebate_money,
                    "activity_id": v.activity_id,
                    "conditions_num": v.conditions_num,
                    "product_type": v.product_type,
                    "sizes": v.sizes,
                    "type": v.type,
                    "total_origin_money": v.total_origin_price,
                    "price_type": v.price_type,
                    "batch_type": v.sale_batches.batch_type,
                    "sub_list": v.sub_list,
                    "order_sort": v.order_sort,
                    "origin_price": v.origin_price,
                };
            }),
            "total_money": cart.new_order_product_list[0].total_money,
            "total_origin_money": cart.new_order_product_list[0].total_origin_money,
            "goods_real_money": cart.new_order_product_list[0].goods_real_money,
            "total_count": cart.new_order_product_list[0].total_count,
            "cart_count": cart.new_order_product_list[0].cart_count,
            "is_presale": cart.new_order_product_list[0].is_presale,
            "instant_rebate_money": cart.new_order_product_list[0].instant_rebate_money,
            "coupon_rebate_money": cart.new_order_product_list[0].coupon_rebate_money,
            "total_rebate_money": cart.new_order_product_list[0].total_rebate_money,
            "used_balance_money": cart.new_order_product_list[0].used_balance_money,
            "can_used_balance_money": cart.new_order_product_list[0].can_used_balance_money,
            "used_point_num": cart.new_order_product_list[0].used_point_num,
            "used_point_money": cart.new_order_product_list[0].used_point_money,
            "can_used_point_num": cart.new_order_product_list[0].can_used_point_num,
            "can_used_point_money": cart.new_order_product_list[0].can_used_point_money,
            "is_share_station": cart.new_order_product_list[0].is_share_station,
            "only_today_products": cart.new_order_product_list[0].only_today_products,
            "only_tomorrow_products": cart.new_order_product_list[0].only_tomorrow_products,
            "package_type": cart.new_order_product_list[0].package_type,
            "package_id": cart.new_order_product_list[0].package_id,
            "front_package_text": cart.new_order_product_list[0].front_package_text,
            "front_package_type": cart.new_order_product_list[0].front_package_type,
            "front_package_stock_color": cart.new_order_product_list[0].front_package_stock_color,
            "front_package_bg_color": cart.new_order_product_list[0].front_package_bg_color,
            "reserved_time": {
                "reserved_time_start": reserve_time.reserved_time_start,
                "reserved_time_end": reserve_time.reserved_time_end,
            },
        }
    ];
    let result = ((await axios({
        method: 'post',
        url: 'https://maicai.api.ddxq.mobi/order/checkOrder',
        data: {
            ...params,
            address_id: user.address_id,
            user_ticket_id: 'default',
            freight_ticket_id: 'default',
            is_use_point: 0,
            is_use_balance: 0,
            is_buy_vip: 0,
            coupons_id: '',
            is_buy_coupons: 0,
            packages: JSON.stringify(packages),
            check_order_type: 0,
            is_support_merge_payment: 1,
            showMsg: false,
            showData: true,
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