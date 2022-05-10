const express = require('express')
const router = express.Router()
const userController = require('../../app/controller/userController')
// 导入自定义加密中间件
const passwordCrypt = require('../../app/middlewares/passwordCrypt')

//将路由挂到路由对象上
router.post('/register', passwordCrypt,userController.adminRegister)
router.post('/login', passwordCrypt,userController.adminLogin)
router.post('/admin/add', passwordCrypt,userController.adminBind)
router.post('/property/employee/add',userController.addPropertyEmployee)
router.post('/property/employee/update',userController.updatePropertyEmployee)


module.exports = router