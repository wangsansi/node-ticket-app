const model = require('../models/systemModels')
const userModel = require('../models/userModels')
const utils = require('../../public/utils')
const queryListBase = async function (queryListModelName,value,res) {
    let queryListModel = model[queryListModelName]
    try {
        let list = await queryListModel(value)
        res.send({
            code: 0,
            msg: 'ok',
            data:list
        })
    } catch (error) {
        console.log(`${queryListModel}: `,error)
        res.send({
            code: 1000,
            msg: '查询失败'
        })
    }
}
const queryDetailsById = async function (queryDetailsModelName,id,res) {
    let queryDetailsModel = model[queryDetailsModelName]
    try {
        let results = await queryDetailsModel(id)
        if (results.length === 0) {
            res.send({
                code: 1001,
                msg: 'not found'
            })
        } else {
            res.send({
                code: 0,
                msg: 'ok',
                data: results[0]
            })
        }
    } catch (error) {
        console.log(`${queryDetailsModel}: `,error)
        res.send({
            code: 1000,
            msg: '查询失败'
        })
    }
}
module.exports={
    // // 添加用户
    // createUser: async (req,res) =>{
    //     /**
    //      * 查询权限
    //      * 权限：
    //      * 开通管理站权限
    //      * 选角色：
    //      */

    // },
    // // 创建物业部门
    // createPropertyDept: async (req, res)=>{
    //     let body = req.body
    //     let {name, leader, leader_id, phone} = body
    //     let sqlArr = [name,leader,leader_id,phone]
    //     model.insertPropertyDept(sqlArr).then((results)=>{
    //         console.log(results)
    //         if (results.affectedRows === 1){
    //             res.send({
    //                 code: 0,
    //                 msg: `ok`
    //             })
    //         } else {
    //             res.send({
    //                 code: 1000,
    //                 msg: `添加失败`
    //             })
    //         }
    //     },(err)=>{
    //         console.log(err)
    //         if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('propertyManagementDepartment.name') !== -1) {
    //             sandObj = {
    //                 code: 1004,
    //                 msg: `重复添加`
    //             }
    //             res.send(sandObj)
    //             return
    //         }
    //         res.send({
    //             code: 1000,
    //             msg: `添加失败`
    //         })
    //     })
    // },
    // // 创建物业职位
    // createPropertyPosition: async (req, res)=>{
    //     let body = req.body
    //     let {name} = body
    //     let sqlArr = [name]
    //     model.insertPropertyPosition(sqlArr).then((results)=>{
    //         console.log(results)
    //         if (results.affectedRows === 1){
    //             res.send({
    //                 code: 0,
    //                 msg: `ok`
    //             })
    //         } else {
    //             res.send({
    //                 code: 1000,
    //                 msg: `添加失败`
    //             })
    //         }
    //     },(err)=>{
    //         console.log(err)
    //         if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('propertyManagementPosition.name') !== -1) {
    //             sandObj = {
    //                 code: 1004,
    //                 msg: `重复添加`
    //             }
    //             res.send(sandObj)
    //             return
    //         }
    //         res.send({
    //             code: 1000,
    //             msg: `添加失败`
    //         })
    //     })
    // },
    // // 创建业委会职位
    // createCommitteePosition: async (req, res)=>{
    //     let body = req.body
    //     let {name} = body
    //     let sqlArr = [name]
    //     model.insertCommitteePosition(sqlArr).then((results)=>{
    //         console.log(results)
    //         if (results.affectedRows === 1){
    //             res.send({
    //                 code: 0,
    //                 msg: `ok`
    //             })
    //         } else {
    //             res.send({
    //                 code: 1000,
    //                 msg: `添加失败`
    //             })
    //         }
    //     },(err)=>{
    //         console.log(err)
    //         if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('committeeposition.name') !== -1) {
    //             sandObj = {
    //                 code: 1004,
    //                 msg: `重复添加`
    //             }
    //             res.send(sandObj)
    //             return
    //         }
    //         res.send({
    //             code: 1000,
    //             msg: `添加失败`
    //         })
    //     })
    // },
    // // 添加住户
    // addResident: async (req, res)=>{
    //     let residentInfo = req.body
    //     let sandObj = {}
    //     // 身份证号验证
    //     if(utils.checkID(residentInfo.identity_num) === false){
    //         sandObj = {
    //             code: 1003,
    //             msg: `身份证无效`
    //         }
    //         res.send(sandObj)
    //         return
    //     }
    //     let create_time = utils.dateFormat('yyyy-MM-dd',new Date())
    //     let sqlArr = [
    //         residentInfo.playload_user_id,
    //         residentInfo.name,
    //         residentInfo.mobile,
    //         residentInfo.identity_num,
    //         Number(residentInfo.resident_type),
    //         Number(residentInfo.proprietor_remark),
    //         residentInfo.building_num,
    //         residentInfo.apartment_num,
    //         residentInfo.room_num,
    //         create_time
    //     ]
    //     console.log(sqlArr)
    //     model.insertResident(sqlArr).then((results)=>{
    //         console.log(results)
    //         if (results.affectedRows === 1){
    //             res.send({
    //                 code: 0,
    //                 msg: `ok`
    //             })
    //         } else {
    //             res.send({
    //                 code: 1000,
    //                 msg: `添加失败`
    //             })
    //         }
    //     },(err)=>{
    //         console.log(err)
    //         if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('resident.user_id') !== -1) {
    //             sandObj = {
    //                 code: 1004,
    //                 msg: `该住户已存在`
    //             }
    //             res.send(sandObj)
    //             return
    //         }
    //         if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('resident.identity_num') !== -1) {
    //             sandObj = {
    //                 code: 1005,
    //                 msg: `该身份证号已存在`
    //             }
    //             res.send(sandObj)
    //             return
    //         }
    //         res.send({
    //             code: 1000,
    //             msg: `添加失败`
    //         })
    //     })
    // },
    // // 添加业委会成员
    // addCommitteeMember: async (req, res)=>{
    //     let body = req.body
    //     let {user_id,name,position_id} = body   
    //     // 查找该用户
    //     model.queryResidentById(user_id).then((queryResult)=>{
    //         console.log('queryResult',queryResult)
    //         // 没有这个住户
    //         if (!queryResult.length){
    //             res.send({
    //                 code: 1001,
    //                 msg: `不存在该住户，请先添加住户`
    //             })
    //         } else {
    //             if (name !== queryResult[0].name){
    //                 console.log('id对，姓名不对')
    //                 res.send({
    //                     code: 1002,
    //                     msg: `该住户信息有误`
    //                 })
    //                 return
    //             }
    //             let sqlArr = [user_id,position_id]
    //             model.insertCommitteeMember(sqlArr).then((results)=>{
    //                 console.log(results)
    //                 if (results.affectedRows === 1){
    //                     model.updateResidentCommitteeInfo([0,user_id]).then((updateResults)=>{
    //                         if (updateResults.affectedRows === 1) {
    //                             model.updateBackstageAuth([1,user_id]).then((updateBackstageAuthResults)=>{
    //                                 if (updateBackstageAuthResults.affectedRows === 1) {
    //                                     res.send({
    //                                         code: 0,
    //                                         msg: `ok`
    //                                     })
    //                                 } else {
    //                                     res.send({
    //                                         code: 1006,
    //                                         msg: `插入成功，开通管理站失败`
    //                                     })
    //                                 }
    //                             },(err)=>{
    //                                 console.log(err)
    //                             })
    //                         } else {
    //                             res.send({
    //                                 code: 1005,
    //                                 msg: `插入成功，更新住户表失败`
    //                             })
    //                         }   
    //                     },(err)=>{
    //                         console.log(err)
    //                     })               
    //                 } else {
    //                     res.send({
    //                         code: 1000,
    //                         msg: `插入失败`
    //                     })
    //                 }
    //             },(err)=>{
    //                 console.log(err)
    //                 if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('committee.user_id') !== -1) {
    //                     sandObj = {
    //                         code: 1004,
    //                         msg: `重复添加`
    //                     }
    //                     res.send(sandObj)
    //                     return
    //                 }
    //                 res.send({
    //                     code: 1000,
    //                     msg: `插入失败`
    //                 })
    //             })
    //         }
    //     })
    // },
    // 查看物业部门列表
    propertyDeptList: async (req, res)=>{
        console.log(req.body)
        queryListBase('queryPropertyDeptList',null,res)
    },
    // 查看物业部门详情
    propertyDeptDetails: async (req, res)=>{
        console.log(req.body)
        queryDetailsById('queryPropertyDeptDetails', req.body.id,res)
    },
    // 查看物业职位列表
    propertyPositionList: async (req, res)=>{
        console.log(req.body)
        queryListBase('queryPropertyPositionList',null,res)
    },
    // 查看物业职位详情
    propertyPositionDetails: async (req, res)=>{
        console.log(req.body)
        queryDetailsById('querypropertyPositionDetails', req.body.id,res)
    },
    // 查看物业员工列表
    propertyEmployeeList: async (req, res)=>{
        console.log(req.body)
        try{
            let {pageSize,pageIndex} = req.body
            let remark
            if (req.body.remark) {
                remark = '未审核'
            } else {
                remark = '审核通过'
            }
            let sqlObj = {
                remark,
                pageSize,
                pageIndex: pageSize ? pageSize*(pageIndex-1) : null
            }
            // 查全部 
            if (req.body.type === 1) {
                let list = await model.queryPropertyEmployeeList(sqlObj)
                res.send({
                    code: 0,
                    msg: 'ok',
                    data:list
                })
            } else if (req.body.type === 2) {
                // 查可以被转单的人。同部门的人员或者其他部门leader和本部门人员              
                let listPromise = model.queryPropertyEmployeeList(sqlObj)
                let employeePromise = model.queryPropertyEmployeeDetails(req.body.playload_user_id)
                let list =  await listPromise
                let employee = await employeePromise
                // let list = await model.queryPropertyEmployeeList(sqlObj)
                // let employee = await model.queryPropertyEmployeeDetails(req.body.playload_user_id)
                console.log('employee',employee)
                let position_id = employee[0].position_id
                let dept_id = employee[0].dept_id
                console.log('position_id',position_id)
                console.log('dept_id',dept_id)
                let employeeList
                if (position_id === 1) {
                    employeeList = list.filter(employee=> employee.position_id === 1 || employee.dept_id === dept_id)
                } else if (position_id === 2) {
                    employeeList = list.filter(employee=> employee.dept_id === dept_id)
                }
                res.send({
                    code: 0,
                    msg: 'ok',
                    data:employeeList
                })
            }    
        }catch(err){
            console.log(err)
            res.send({
                code: 1000,
                msg: '查询失败'
            })
        } 
    },
    // 查看物业员工详情
    propertyEmployeeDetails: async (req, res)=>{
        console.log(req.query)
        let user_id = req.query.user_id
        try {
            let user = await model.queryPropertyEmployeeDetails(user_id)
            if (user.length>0) {
                res.send({
                    code: 0,
                    msg: 'ok',
                    data:user[0]
                })
            } else {
                res.send({
                    code: 1000,
                    msg: '查询失败'
                })
            }
        } catch (error) {
            console.log(`propertyEmployeeDetails`,error)
            res.send({
                code: 1000,
                msg: '查询失败'
            })
        }
    },
    // 管理站菜单查询
    adminMenu: async(req, res)=>{
        let id = req.query.user_id
        let showAdmin
        let showDistribute = false
        try {
            let [results, empresults] = await Promise.all([
                await userModel.queryUserAdminAuth(id), 
                await model.queryPropertyEmployeeDetails(id)
            ]);
    
            results.length && (showAdmin = results[0].is_admin) 
            empresults.length && empresults[0].dept_name.includes('客服') && (showDistribute = true)
            res.send({
                code: 0,
                msg: 'ok',
                data: {
                    showAdmin: showAdmin ? true : false,
                    showDistribute
                }
            })
        } catch(err){
            console.log('[adminMenuErr]:',err)
            res.send({
                code: 1000,
                msg: '查询失败'
            })
        }
        
    }
}