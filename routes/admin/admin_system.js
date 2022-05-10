const express = require('express')
const router = express.Router()
const systemController = require('../../app/controller/systemController')


//查看物业成员列表
router.post('/property/employee/list', systemController.propertyEmployeeList)
//查看物业员工详情
router.get('/property/employee/details',systemController.propertyEmployeeDetails)
//查看物业部门列表
router.get('/property/dept/list', systemController.propertyDeptList)
//查看物业部门详情
router.post('/property/dept/details', systemController.propertyDeptDetails)
//查看物业职位列表
router.get('/property/position/list', systemController.propertyPositionList)
//查看物业职位详情
router.post('/property/position/details', systemController.propertyPositionDetails)
//查询菜单是否显示admin
router.get('/menu', systemController.adminMenu)

module.exports = router