
const express = require('express')

const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const app = express()
const port = 3001
const checkToken = require('./app/middlewares/checkToken')
const checkParam = require('./app/middlewares/checkParam')
// 使用bodyParser中间件来接收post数据
app.use(bodyParser.urlencoded({extended: false}))
// 接收json数据
app.use(bodyParser.json())

app.use(cookieSession({
    // 在cookie中用户记录sessionid的名字
    name: 'sessionID',
    // 用户对明文的sessionID进行加密处理，内容任意，但必须要写
    secret: 'vgyuikmnbvcds',
    // 过期时间20分钟
    maxAge: 20*60*1000,
    // 滚动刷新
    rolling: true
}))

// 支持跨域访问
app.all('*', function (req, res, next) {
    let allowedOrigins = ['http://124.221.141.133','http://127.0.0.1:3000', 'http://localhost:3000'];
    let origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Headers', 'origin,accept,content-type,Authorization');
    if (req.method.toUpperCase() === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});
app.use(checkToken)
app.use(checkParam)

// 管理站用户
app.use('/api/admin/v1/user',require('./routes/admin/admin_user'))
// 管理站系统管理
app.use('/api/admin/v1/system',require('./routes/admin/admin_system'))

// 管理站工单
app.use('/api/admin/v1/ticket',require('./routes/admin/admin_ticket'))
// 上传图片
app.use('/api/tx/v1/cos',require('./routes/tx/cos'))

app.listen(port, () => console.log(`app is running at http://127.0.0.1:${port}!`))