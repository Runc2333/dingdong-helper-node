# 叮咚买菜抢菜助手（Node.js）
使用iOS客户端原生API，支持高峰期下单、支持捡漏、支持多账号、支持webhook通知（需自行实现对端）

Telegram 交流群组：[点击加入](https://t.me/weneedfood)

## 写在前面

本项目旨在帮助更多的人能吃上饭，吃上饱饭。虽许可证允许，但我们*不支持*您通过本项目牟利。

若您在满足自身需求后仍有余力，请更多的帮助身边的人，尤其是独居老人。

**写给叮咚买菜官方**：本项目已尽最大努力防止贵司利益受损，包括但不限于签名算法、接口参数等。如若贵司认为本项目侵犯了贵司的权益，请邮件联系 `i@runc321.com`，我们将会停用本项目。

少让程序员加班，从你我做起。

## 2022-05-01 重大更新

`api_version: 9.50.1`

> 2022-05-01 19:42: 拉取最新repo时请再执行一次安装依赖的命令，添加了播放音频的库
>
> 2022-05-01 21:19: 拉取最新repo时请重新配置`config.js`，添加了多线程相关设置

**使用iOS原生客户端API，下单与iOS真机无差异，已测试可成功下单。**

**请注意：** 更新后配置文件结构有更改，需要重新配置。

　　　　 更新前的 Session 文件不继续适用于本项目，请重新获取。

特别感谢 [@IMLR](https://github.com/IMLR) 完成的`sesi`和`nars`签名算法分析。

## 配置项目

### 安装依赖

>  *若您没有`node.js`运行环境，请先安装`node.js`*
>
>  *随后执行`npm i yarn -g`来全局安装`yarn`*

**在终端执行如下命令以安装依赖：**


```
yarn
```


### 更改设置

1、将项目`config/config.example.js`复制一份为`config/config.js`

2、修改其中提供的选项

```js
webhook_url: '', // 下单成功通知url，暂无配套实现，如未阅读源码请**不要**填写
thread_count: 2, // 下单时创建的线程数，建议不要超过3
thread_interval: 100, // 线程创建间隔，建议不要低于100，单位ms
submit_interval_min: 20 * 1000, // 随机最小请求间隔时间，单位ms
submit_interval_max: 50 * 1000, // 随机最大请求间隔时间，单位ms
minimal_order_money: 0, // 小于该金额的订单不会被提交
api_channel: 'ios-native', // 可选 'ios-native', 'android-native' 或 'applet', 目前仅支持 'ios-native'
profiles: [
    {
        seq: 0, // 指示程序读取charles_sessions目录下的第几个文件
        im_secret: '',// 通过抓包获取，用于签名请求，获取请参见下文
        alias: '', // 配置文件别名，用于在下单成功时提示是哪个账号
    }
],
```
### 获取 Session

> 如果无法找到所列出的请求，请[参见](#ios%20%E8%AE%BE%E5%A4%87-charles-%E6%8A%93%E5%8C%85%E5%B8%AE%E5%8A%A9)

1、在**iOS设备**上启动叮咚买菜APP

2、完成登录

3、启动Charles并完成抓包配置（需要配置SSL抓包）

4、点击“购物车”并刷新

5、在请求中找到`https://maicai.api.ddxq.mobi/cart/index`

6、右击该请求，选择`Export Session`，保存到项目`charles_sessions`文件夹下，文件类型请选择`JSON Session File (.chlsj)`

### 获取 im_secret

接续 获取 Session 第三步

4、点击“我的”并刷新

5、在请求中找到`https://sunquan.api.ddxq.mobi/api/v1/user/detail`

6、左击该请求，选择`Contents`选项卡，在下半部分选项卡中选择`JSON Text`视图

7、找到`user_info`下的`im_secret`字段，复制其值到配置文件中

## 可用执行选项

### 速抢模式

> 建议抢菜高峰(06:00, 08:30)前一分钟启动，运行不要超过三分钟，否则账号会被风控

```
yarn checkout:speed
```

### 捡漏模式

> 建议运行不要超过六小时，否则极易被封号
>
> 配置文件内可调请求间隔，默认20s ~ 50s随机
>
> 捡漏模式的下单步骤不受请求间隔限制，默认逻辑为同时满足购物车有货和配送时间可用时疯狂下单，因此请勿在无人值守的情况下运行

```
yarn checkout:normal
```

## iOS 设备 Charles 抓包帮助

因应用可主动选择不使用系统http代理，因此您需要一个第三方应用程序来实现抓包。

由 [@iiwen](https://github.com/iiwen) 撰写的 [完整图文抓包教程参见](https://www.jianshu.com/p/0191790ba30e)

## Webhook

> 您需要根据所使用的客户端，自行修改源代码进行适配

默认情况下，在您配置好`webhook_url`后，下单成功时会向该地址发送一个`POST`请求，`body`为`JSON`格式，包含如下字段：

```js
{
	profile: '测试', // 配置文件中填写的别名
	price: 0.01, // 本次下单金额
	arrival_time: '14:30-22:00', // 本次下单的预约时间
	raw: {
		cart: ..., // 原始的购物车数据
		order: ..., // 原始的订单数据
		reserve_time: ..., // 原始的预约时间数据
	}
}
```

您可以通过修改`/service/webhook.js`来改变请求发送的方式、`body`的格式和内容，但入参（`{ profile, order, reserve_time, cart }`）不能修改。

## 下单成功提示音

下单成功时会播放`/assets/success.mp3`，默认为小猪佩奇，可自行替换。

目前不支持关闭。

## 免责声明

本程序使用 GNU General Public License v3.0 开源、不提供任何担保。使用本程序即表明，您知情并同意：

- 使用本程序造成的一切后果由您本人承担，作者不会对您的任何损失负责，包括但不限于服务中断、Kernel Panic、机器无法开机或正常使用、数据丢失或硬件损坏、原子弹爆炸、第三次世界大战、SCP 基金会无法阻止 SCP-3125 引发的全球 MK 级现实重构等
- 如若您修改了本程序并发布，您需要使用相同协议开源
