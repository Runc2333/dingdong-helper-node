# 叮咚买菜抢菜助手（Node.js）
支持高峰期下单、支持捡漏、支持多账号、支持webhook通知（需自行实现对端）

## 2022-04-29 更新

`api_version: 9.21.0`

`app_version: 2.30.3`

换用中国建设银行API，添加自动获取默认收货地址功能。

Session获取方式有改变，请注意重新获取session。

**已测试可成功下单**

## 关于`请返回建行APP进行登录`问题

目前测试，账号必须绑定银行卡后才能正常使用建设银行app内的叮咚买菜。

有计划适配其他入口，若您当前无建设银行卡片，可换用其他项目或关注本项目更新。

## 配置项目

### 安装依赖

`yarn`

## 更改设置

1、将项目`config/config.example.js`复制一份为`config/config.js`

2、修改其中提供的选项

```
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
```
## 获取Session

1、启动中国建设银行APP

2、搜索并打开叮咚买菜

3、完成登录

4、启动Charles并完成抓包配置（需要配置SSL抓包）

5、点击购物车并刷新

6、在请求中找到`https://maicai.api.ddxq.mobi/cart/index`

7、右击该请求，选择`Export Session`，保存到项目`charles_sessions`文件夹下，文件类型请选择`JSON Session File (.chlsj)`

## 可用选项

### 速抢模式

建议抢菜高峰(06:00, 08:30)前一分钟启动，运行不要超过三分钟，否则账号会被风控。

`yarn checkout:speed`

### 捡漏模式

配置文件内可调请求间隔，默认20s ~ 50s随机

`yarn checkout:normal`
