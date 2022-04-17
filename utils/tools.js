module.exports = {
    parse_query: (query) => {
        let query_obj = {};
        if (query.indexOf('?') !== -1) query = query.split('?')[1];
        query.split('&').forEach(item => {
            let [key, value] = item.split('=');
            query_obj[key] = value;
        });
        return query_obj;
    },
    random_string: (len) => {
        let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < len; i++) {
            result += str[Math.floor(Math.random() * str.length)];
        }
        return result;
    },
    rand_between: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
};