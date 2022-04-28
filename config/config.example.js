global.config = {
    dingdong: {
        webhook_url: '', // 下单成功通知url，暂无配套实现
        submit_interval_min: 20 * 1000, // 随机最小请求间隔时间
        submit_interval_max: 50 * 1000, // 随机最大请求间隔时间
        minimal_order_money: 0, // 小于该金额的订单不会被提交
        profiles: [
            {
                seq: 0, // 指示程序读取charles_sessions目录下的第几个文件
                alias: '', // 配置文件别名，用于在下单成功时提示是哪个账号
            }
        ],
    },
    log: {
        enable: true,
        console_level: 'debug', // Specific level will be output to console, can be trace debug info warn error
        log_level: 'debug', // Specific level will be write to file, can be trace debug info warn error
        folder: './log',
        log_split: true, // split log file by day
    },
};