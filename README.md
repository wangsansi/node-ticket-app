# node+express+mysql 工单系统

工单系统的后端代码，包含用户、权限、工单发布、工单流程等

PC端：https://github.com/wangsansi/react-ticket-app

小程序端：https://github.com/wangsansi/frogla2.0

## demo

[http://124.221.141.133/](http://124.221.141.133/)

## 开发环境

node+express+mysql

## 启动

```
// 将ticket.sql导入到自己的数据库中
mysql>source ticket.sql

// 修改数据库信息
路径：config/mysql.js

// 修改图片上传服务器信息
路径：app/controller/baseController.js

// 启动
npm install
node app.js
```
## 截图

![image](https://user-images.githubusercontent.com/25080434/167791188-39e591bc-5012-401c-9d11-65952347be93.png)


