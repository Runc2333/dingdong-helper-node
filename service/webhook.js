module.exports = ({ profile, order, reserve_time, cart }) => {
    axios({
        method: "post",
        url: config.dingdong.webhook_url,
        data: {
            profile: profile.alias,
            price: order.order.total_money,
            arrival_time: reserve_time.time_text,
            raw: {
                cart: cart,
                order: order,
                reserve_time: reserve_time,
            }
        }
    });
};