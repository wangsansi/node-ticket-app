// 导入jwt加密
const jwt = require('jsonwebtoken')
const fs = require('fs')
// 生成token，不管fs读文件的操作挪到任何地方，其路径都不要动，其始终相对于入口文件
const jwt_secret = fs.readFileSync('./.env','utf-8')

let checkToken = function(req,res,next){
    console.log('进入checkToken中间件',req.path)
    let allowList = [
        '/api/admin/v1/user/register',
        '/api/admin/v1/user/login',
        '/api/admin/v1/user/admin/add',
        '/api/admin/v1/system/property/dept/list',
        '/api/admin/v1/system/property/position/list',
        '/api/tx/v1/cos/sts',
        '/api/tx/v1/cos/authorization'
    ]
    if (allowList.includes(req.path)) {
        console.log('不验证token')
        next()
        return
    }
    console.log('开始验证token')
    // 获取token
    let token
    // token是否存在
    try {
        let tokenArray = req.headers.authorization.split(' ')
        token = tokenArray[tokenArray.length-1]
    } catch (error) {
        // 缺少token
        res.send({
            code: '10001',
            msg: '缺少token'
        })
        return
    }

    let playload
    // 解密是否成功
    try {
        playload = jwt.verify(token, jwt_secret)
    } catch (error) {
        // 错误的token
        res.send({
            code: '10002',
            msg: 'token错误'
        })
        return 
    }
    // token 是否失效
    let createDay = new Date(playload.iat *1000).getDate()
    if (new Date().getDate() !== createDay) {
        // token过期
        res.send({
            code: '10003',
            msg: 'token已过期'
        })
        return 
    }
    // if (new Date().getTime() - (playload.iat *1000) > 60*60*1000) {
    //     // token过期
    //     res.send({
    //         code: '10003',
    //         msg: 'token已过期'
    //     })
    //     return 
    // }
    // 成功
    req.body.playload_user_id = playload.user_id
    next()
}

module.exports = checkToken