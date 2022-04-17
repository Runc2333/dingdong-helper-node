# 叮咚抢菜助手（Node.js）
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
        address_id: '', // 下单使用的收货地址ID，获取请参见下文
        alias: '', // 配置文件别名，用于在下单成功时提示是哪个账号
    }
],
```
## 获取Session

1、启动微信

2、打开叮咚买菜小程序

3、完成登录

4、启动Charles并完成抓包配置（需要配置SSL抓包）

5、点击首页任意分类

6、在请求中找到`https://maicai.api.ddxq.mobi/homeApi/categoriesNewDatail`

7、右击该请求，选择`Export Session`，保存到项目`charles_sessions`文件夹下，文件类型请选择`JSON Session File (.chlsj)`

## 获取收货地址ID（`address_id`）

接获取Session的第四步后：

5、添加任意商品，转到购物车选项卡，选择去结算

6、在请求中找到`https://maicai.api.ddxq.mobi/order/checkOrder`

7、左击该请求，在提供的选单中选择`Contents`，视图选择`Form`，复制其中的`address_id`字段
## 可用选项

### 速抢模式

建议抢菜高峰(06:00, 08:30)前一分钟启动，运行不要超过三分钟，否则账号会被风控。

`yarn checkout:speed`

### 捡漏模式

配置文件内可调请求间隔，默认20s ~ 50s随机

`yarn checkout:normal`
