// 导入MD5加密
const md5 = require('md5')

let passwordCrypt = function(req,res,next){
    console.log('passwordCrypt',req.body)
    //直接MD5加密有被破解的风险，此处使用加盐加密
    req.body.password = md5(req.body.password + md5(req.body.password).substr(10,10))
    next()
}

module.exports = passwordCrypt