global.config = {
    dingdong: {
        webhook_url: '', // 下单成功通知url，暂无配套实现，如未阅读源码请**不要**填写
        submit_interval_min: 20 * 1000, // 随机最小请求间隔时间
        submit_interval_max: 50 * 1000, // 随机最大请求间隔时间
        minimal_order_money: 0, // 小于该金额的订单不会被提交
        api_channel: 'ios-native', // 可选 'ios-native', 'android-native' 或 'applet', 目前仅支持 'ios-native'
        profiles: [
            {
                seq: 0, // 指示程序读取charles_sessions目录下的第几个文件
                im_secret: '',// 通过抓包获取，用于签名请求
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