const jwt = require('jsonwebtoken')
const fs = require('fs')

// 生成token，不管fs读文件的操作挪到任何地方，其路径都不要动，其始终相对于入口文件
const jwt_secret = fs.readFileSync('./.env','utf-8')
const utils = require('../../public/utils')


//导入model
const model = require('../models/userModels')
const systemModel = require('../models/systemModels')


let getResidentInfo = (user_id)=>{
    return new Promise((resolve, reject)=>{
        model.queryResidentInfo(user_id).then((results)=>{
            if(!results.length){
                //没有用户，输出json数据，告诉用户没有数据
                reject('还没有绑定')
            } else {
                //有这个用户，（签发jwt）
                console.log('[results]',results)
                resolve(results) 
            }
        },(err)=>{
            reject(err);
        })
    })   
}
module.exports = {
    userRegister:(req, res)=>{
        let {user_name, password} = req.body
        model.insertUser([user_name,password]).then((results)=>{
            console.log('results',results)
            if (results.affectedRows === 1){
                res.send({
                    code: 0,
                    msg: `ok`
                })
            } else {
                res.send({
                    code: 1000,
                    msg: `注册失败`
                })
            }
        },(err)=>{
            if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('user.name') !== -1) {
                sandObj = {
                    code: 1004,
                    msg: `该用户名已注册`
                }
                res.send(sandObj)
                return
            }
            console.log(err)
            res.send({
                code: 1000,
                msg: `注册失败`
            })
        })
    },
    // 住户登录
    residentLogin: (req, res) => {
        let {name, password} = req.body
        console.log('[req.body]',req.body)
        model.queryUserLogin([name,password]).then((results)=>{
            let sandObj = {}
            console.log('userLoginResults',results)
            if(!results.length){
                //没有用户，输出json数据，告诉用户没有数据
                res.send({
                    code: 1001,
                    msg: '账号或密码错误'
                })    
            } else {
                let user_id = results[0].user_id
                getResidentInfo(user_id).then((residentResults)=>{
                    let data = Object.assign(residentResults[0],{
                        token: jwt.sign({user_id: user_id},jwt_secret)
                    })
                    req.session.user_info = data
                    // 已绑定，发送住户信息和token
                    res.send({
                        code: 0,
                        msg: 'ok',
                        data
                    })
                },(err)=>{
                    console.log('getResidentInfo',err)
                    // 未绑定，只发送token
                    res.send({
                        code: 0,
                        msg: 'ok',
                        data: {
                            token: jwt.sign({user_id: results[0].user_id},jwt_secret),
                        }
                    })
                })
            }
        },(err)=>{
            res.send({
                code: 1000,
                msg: `登录失败`
            })
        })
    },
    // 管理站注册
    adminRegister: async (req, res) => {
        console.log(req.body)
        try {
            let {user_name,password} = req.body
            let results = await model.insertUser([user_name,password,1])
            if (results.affectedRows === 1) {
                res.send({
                    code: 0,
                    msg: 'ok'
                })
            } else {
                res.send({
                    code: 1000,
                    msg: `用户注册失败`
                })
            }
        }catch(err){
            if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('user.name') !== -1) {
                res.send({
                    code: 1004,
                    msg: `该用户名已注册`
                })
            } else {
                res.send({
                    code: 1000,
                    msg: `用户注册失败`
                })
            }
        }
    },
    // 管理站登录
    adminLogin: async (req, res)=>{
        let {user_name, password} = req.body
        console.log('[req.body]',req.body)
        try {
            let results = await model.queryUserLogin([user_name,password])
            console.log('userLoginResults',results)
            if(results.length > 0){
                let user_id = results[0].user_id
                let is_employee = results[0].is_employee
                if (is_employee) {
                    let employeeRes = await systemModel.queryPropertyEmployeeDetails(user_id)
                    if (employeeRes.length > 0) {
                        if (employeeRes[0]['remark']==='审核通过') {
                            console.log('进入')
                            res.send({
                                code: 0,
                                msg: 'ok',
                                data: Object.assign({},{
                                        token: jwt.sign({user_id: user_id},jwt_secret),
                                      },{user_info:employeeRes[0]})
                            })
                        } else if (employeeRes[0]['remark']==='未审核') {
                            console.log('未审核')
                            res.send({
                                code: 0,
                                msg: 'ok',
                                data: {}
                            })
                        } 
                    } else {
                        console.log('绑定')
                        res.send({
                            code: 0,
                            msg: 'ok',
                            data: {
                                token: jwt.sign({user_id: user_id},jwt_secret),
                                user_id
                            }
                        })  
                    }
                    console.log('employeeRes',employeeRes)
                    // 搜employee表
                    // 有且remark=审核，进入
                    // 有且remark=未审核，告知用户
                    // 没有，绑定
                } else {
                    let committeeRes = await systemModel.queryCommitteeMemberDetails(user_id)
                    if (committeeRes.length > 0) {
                        console.log('进入')
                        res.send({
                            code: 0,
                            msg: 'ok',
                            data: Object.assign({},{
                                    token: jwt.sign({user_id: user_id},jwt_secret)
                                    },{user_info: committeeRes[0]})
                        })
                    } else {
                        res.send({
                            code: 1002,
                            msg: '无权限'
                        })  
                        
                    }
                    // 搜业委会表
                    // 有进入
                    // 没有返回失败
                }
                
            } else {
                //没有用户，输出json数据，告诉用户没有数据
                res.send({
                    code: 1001,
                    msg: '账号或密码错误'
                })
            }
        }catch(err){
            res.send({
                code: 1000,
                msg: `登录失败`
            })
        }
    },
    // 管理站绑定管理员，
    adminBind: async (req, res) => {
        let {user_name, password} = req.body
        try {
            let results = await model.queryUserExist(user_name)
            let user_id = results[0].user_id
            let is_employee = results[0].is_employee
            console.log('password',password)
            // 存在这个用户
            if(results.length > 0){
                // 密码6y_Db5t4
                if (password === 'b0dc764eab7595d39c945eb5022c9f4c') {
                    // 更新is_admin
                    let updateRes = await model.updateUserAdmin(user_name)
                    // 更新成功
                    if(updateRes.affectedRows === 1) {
                        // 是员工
                        if (is_employee) {
                            let employeeRes = await systemModel.queryPropertyEmployeeDetails(user_id)
                            if (employeeRes.length > 0) {
                                if (employeeRes[0]['remark']==='未审核') {
                                    console.log('改成审核通过')
                                    let r = await model.updateEmployeeStatus(user_id)
                                    if (r.affectedRows === 1) {
                                        // 如果是主任，添加为部门负责人
                                        if(employeeRes[0].position_id === 1) {
                                            systemModel.updatePropertyDeptList([
                                                employeeRes[0].user_id,
                                                employeeRes[0].name,
                                                employeeRes[0].mobile,
                                                employeeRes[0].dept_id
                                            ]).then((updateRes)=>{
                                                if (updateRes.affectedRows === 1) {
                                                    res.send({
                                                        code: 0,
                                                        msg: `ok`
                                                    })
                                                } else {
                                                    res.send({
                                                        code: 1004,
                                                        msg: `添加部门负责人失败`
                                                    })
                                                }
                                            },(err)=>{
                                                console.log('[updatePropertyDeptListErr]:' ,err)
                                                res.send({
                                                    code: 1004,
                                                    msg: `添加部门负责人失败`
                                                })
                                            })
                                        } else {
                                            res.send({
                                                code: 0,
                                                msg: `ok`
                                            })
                                        }
                                        
                                    } else {
                                        res.send({
                                            code: 1003,
                                            msg: '用户信息审核失败'
                                        })
                                    }
                                } else {
                                    res.send({
                                        code: 0,
                                        msg: 'ok'
                                    })
                                }
                            } else {
                                // 已注册没有填写信息
                                res.send({
                                    code: 1002,
                                    msg: '该用户还未提交信息'
                                })  
                            }
                        } else {
                        // 是业委会
                        }
                    } else {
                        res.send({
                            code: 1000,
                            msg: `添加失败`
                        })
                    }
                } else {
                    res.send({
                        code: 1001,
                        msg: '账号密码错误'
                    })
                }         
            } else {
                //没有用户，输出json数据，告诉用户没有数据
                res.send({
                    code: 1001,
                    msg: '账号密码错误'
                })
            }
        }catch(err){
            console.log('[adminBind]:',err)
            res.send({
                code: 1000,
                msg: `添加失败`
            })
        }
    },
    // 添加物业员工
    addPropertyEmployee: async (req, res)=>{
        let employeeInfo = req.body
        let sandObj = {}
        // 身份证号验证
        if(utils.checkID(employeeInfo.identity_num) === false){
            sandObj = {
                code: 1003,
                msg: `身份证无效`
            }
            res.send(sandObj)
            return
        }
        let create_time = utils.dateFormat('yyyy-MM-dd',new Date())
        let sqlArr = [
            employeeInfo.playload_user_id,
            employeeInfo.job_num,
            employeeInfo.name,
            employeeInfo.sex,
            employeeInfo.mobile,
            employeeInfo.identity_num,
            Number(employeeInfo.dept_id), // 部门id
            Number(employeeInfo.position_id), // 岗位id
            create_time,
            employeeInfo.remark,
        ]
        console.log(sqlArr)
        model.insertPropertyEmployee(sqlArr).then((results)=>{
            console.log(results)
            if (results.affectedRows === 1){
                res.send({
                    code: 0,
                    msg: `ok`
                })
            } else {
                res.send({
                    code: 1000,
                    msg: `插入失败`
                })
            }
        },(err)=>{
            console.log(err)
            if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('employee.user_id') !== -1) {
                res.send({
                    code: 1004,
                    msg: `该用户已存在`
                })
            } else if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('employee.identity_num') !== -1) {
                res.send({
                    code: 1005,
                    msg: `该身份证号已存在`
                })
            } else if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('employee.mobile') !== -1) {
                res.send({
                    code: 1006,
                    msg: `该手机号已存在`
                })
            } else if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('employee.job_num') !== -1) {
                res.send({
                    code: 1007,
                    msg: `该工号已存在`
                })
            } else {
                res.send({
                    code: 1000,
                    msg: `插入失败`
                })
            }
            
        })
    },
    updatePropertyEmployee: async (req, res)=>{
        let employeeInfo = req.body
        let sandObj = {}
        // 身份证号验证
        if(utils.checkID(employeeInfo.identity_num) === false){
            sandObj = {
                code: 1003,
                msg: `身份证无效`
            }
            res.send(sandObj)
            return
        }
        let update_time = utils.dateFormat('yyyy-MM-dd',new Date())
        let sqlArr = [
            employeeInfo.job_num,
            employeeInfo.name,
            employeeInfo.sex,
            employeeInfo.mobile,
            employeeInfo.identity_num,
            Number(employeeInfo.dept_id), // 部门id
            Number(employeeInfo.position_id), // 岗位id
            update_time,
            employeeInfo.remark,
            employeeInfo.user_id
        ]
        console.log(sqlArr)
        model.updatePropertyEmployee(sqlArr).then((results)=>{
            console.log(results)
            if (results.affectedRows === 1){
                // 更新部门信息
                if(Number(employeeInfo.position_id) === 1) {
                    systemModel.updatePropertyDeptList([
                        employeeInfo.user_id,
                        employeeInfo.name,
                        employeeInfo.mobile,
                        Number(employeeInfo.dept_id)
                    ]).then((updateRes)=>{
                        if (updateRes.affectedRows === 1) {
                            res.send({
                                code: 0,
                                msg: `ok`
                            })
                        } else {
                            res.send({
                                code: 1001,
                                msg: `添加部门负责人失败`
                            })
                        }
                    },(err)=>{
                        console.log('[updatePropertyDeptListErr]:' ,err)
                        res.send({
                            code: 1001,
                            msg: `添加部门负责人失败`
                        })
                    })
                } else {
                    res.send({
                        code: 0,
                        msg: `ok`
                    })
                }
            } else {
                res.send({
                    code: 1000,
                    msg: `更新失败`
                })
            }
        },(err)=>{
            console.log('[updatePropertyEmployeeErr]:', err)
            if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('employee.identity_num') !== -1) {
                res.send({
                    code: 1005,
                    msg: `该身份证号已存在`
                })
            } else if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('employee.mobile') !== -1) {
                res.send({
                    code: 1006,
                    msg: `该手机号已存在`
                })
            } else if (err.indexOf('Duplicate entry') !== -1 && err.indexOf('employee.job_num') !== -1) {
                res.send({
                    code: 1007,
                    msg: `该工号已存在`
                })
            } else {
                res.send({
                    code: 1000,
                    msg: `更新失败`
                })
            }
            
        })
    },
   
}