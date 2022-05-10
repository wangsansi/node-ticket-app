const utils = require('../../public/utils')

const model = require('../models/ticketModels')
const user_model = require('../models/userModels')
const system_model = require('../models/systemModels')
let getResidentInfo = (user_id)=>{
    return new Promise((resolve, reject)=>{
        user_model.queryResidentInfo(user_id).then((results)=>{
            if(!results.length){
                //没有用户，输出json数据，告诉用户没有数据
                reject(1005)
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
// 查询工单
async function getTicketById (ticket_id) {
    let ticketList = await model.queryTicketById(ticket_id)
    if (ticketList.length === 0) {
        throw new Error('1002')
    }
    return ticketList[0]
}

// 更新工单
async function updateTicket(sqlArr) {
    let results = await model.updateTicket(sqlArr)
    if (results.affectedRows === 1){
        return 'ok'
    } else {
        throw new Error('1004')
    }
}

module.exports={
    // 创建工单
    insertTicket: async (req,res)=>{
        let {title,content,attachment,category,playload_user_id} = req.body
        console.log(req.body)
        let create_time = utils.dateFormat('yyyy-MM-dd hh:mm:ss',new Date())
        let creator_id = playload_user_id
        let creator
        try {
            let creators = await user_model.queryEmployeeInfo(creator_id)
            if(creators.length>0){
                creator = (creators[0]).name
            } else {
                res.send({
                    code: 1000,
                    msg: `工单创建失败`
                })
                return
            }
            let arr = [
                title,
                content,
                attachment,
                create_time,
                creator_id,
                creator,
                category
            ]
            console.log('arr',arr)
            model.insertTicket(arr).then((results)=>{
                if (results.affectedRows === 1){
                    res.send({
                        code: 0,
                        msg: `ok`
                    })
                } else {
                    res.send({
                        code: 1000,
                        msg: `工单创建失败`
                    })
                }
            },(err)=>{
                if (err.indexOf('Duplicate entry') !== -1) {
                    res.send({
                        code: 1004,
                        msg: `重复提交`
                    })
                } else {
                    res.send({
                        code: 1000,
                        msg: `工单创建失败`
                    })
                }
            })

        }catch(e){
            console.log('insertTicketErr',e)
            res.send({
                code: 1000,
                msg: `工单创建失败`
            })
        }
    },
    // 查询工单列表
    getTicketsList: async (req,res)=>{
        // type 1 全部; 2 部分
        let data = req.body
        data.type = Number(data.type)
        try{
            data.pageIndex = data.pageSize*(data.pageIndex-1)
            let results = await model.queryTicketsList(data)
            let employeeList = await system_model.queryPropertyEmployeeList({remark: '审核通过'})
            let deptList = await system_model.queryPropertyDeptList()
           
            let departmentList = {}
            deptList.forEach(element => {
                departmentList[element.id] = element.name
            })
            
            let employeeNameList = {}
            employeeList.forEach(element => {
                employeeNameList[element.user_id] = element.name
            })

            if(results.list.length > 0) {
                results.list.forEach(async(item)=>{
                    if (item.dept_id) {                   
                        item.dept_name = departmentList[item.dept_id]
                    }
                    if (item.current_handler) {
                       item.current_handler_name = employeeNameList[item.current_handler]
                    }
                }) 
            }
            console.log(results)
            res.send({
                code: 0,
                msg: 'ok',
                data:results
            })
        }catch(err){
            console.log('getTicketdetailsErr: ',err)
            res.send({
                code: 0,
                msg: 'ok',
                data:[]
            })
        }
    },
    // 查询工单详情
    getTicketdetails: async (req,res)=>{
        let id = req.query.ticket_id
        try {
            let result = await getTicketById(id)
            // 已删除
            if (result.del_flag === 2) {
                throw new Error('1003')
            }
            // 查询相关人员名字列表
            let relativeStaff = result.relative_staff
            let relativeStaffNameList = {}
            if (relativeStaff) {
                let relativeStaffList = await system_model.queryPropertyEmployeeName(relativeStaff)            
                relativeStaffList.forEach(i=> {
                    relativeStaffNameList[i.user_id] = i.name
                })
            } 
            console.log('relativeStaffNameList',relativeStaffNameList)
            
            let processList = JSON.parse(result.process_list)
            if (processList && processList.length > 0) {
                processList = processList.map(i=>{
                    return {
                        from: relativeStaffNameList[i.from],
                        to: relativeStaffNameList[i.to],
                        desc: i.desc,
                        attachment: i.attachment
                    }
                })
            }
            result.process_list = processList? JSON.stringify(processList): null
            // 部门名字和职位名字
            let deptObj = await system_model.queryPropertyDeptDetails(result.dept_id)
            let ctgObj = await model.queryTicketCategoryById(result.category)
            
            if (deptObj.length > 0) {
                result.dept_name = deptObj[0].name
            }
            if (ctgObj.length > 0) {
                result.category_name = ctgObj[0].name
            }
            res.send({
                code: 0,
                msg: 'ok',
                data:result
            })
        } catch (err) {
            let errObj = {
                '1002':'没有此工单',
                '1003':'该工单已删除'
            }
            if (errObj[err.message]) {
                res.send({
                    code: err.message,
                    msg: errObj[err.message]
                })
            } else {
                res.send({
                    code: '1010',
                    msg: '系统错误'
                })
            }
            console.log('getTicketdetailsErr: ',err)
        }
    },
    // 客服分单
    distributeTicket: async (req,res) =>{
        /**
         * -------
         * 查询权限
         * -------
         */
        let {dept_id,category_id,ticket_id} = req.body

        try{
            let ticket = await getTicketById(ticket_id)
            if (ticket.del_flag === 2) {
                throw new Error('1003')
            } 
            if (ticket.status === 0) {
                let result = await system_model.queryPropertyEmployeeLeader(dept_id)
                let leader_id = result[0].leader_id
                if(!leader_id){
                    throw new Error('1004')
                }
                    // 处理时间
                let  update_time = utils.dateFormat('yyyy-MM-dd',new Date()),
                    // 状态处理中
                    status = 1,
                    relative_staff = leader_id,
                    current_handler = leader_id
                let sqlArr = [
                    Number(status),
                    update_time,
                    dept_id,
                    category_id,
                    relative_staff,
                    current_handler,
                    Number(ticket_id)        
                ]
                console.log(sqlArr)
                // 可以分单
                let r = await model.updateTicketDept(sqlArr)
                if (r.affectedRows === 1) {
                    res.send({
                        code: 0,
                        msg: 'ok'
                    })
                } else {
                    throw new Error('1004')
                }
            } else {
                throw new Error('1005')
            }      
        }catch(err){
            console.log('distributeTicketErr', err)
            let errObj = {
                '1002':'没有此工单',
                '1003':'该工单已删除',
                '1004':'分单失败',
                '1005':'该状态不能分单'
            }
            if (errObj[err.message]) {
                res.send({
                    code: err.message,
                    msg: errObj[err.message]
                })
            } 
        }
    },
    // 转单
    transferTicket: async (req,res)=>{
        let {
            ticket_id, 
            handler,
            desc, 
            attachment, 
            playload_user_id
        } = req.body
        try {
            let ticket = await getTicketById(ticket_id)
            if (ticket.del_flag === 2) {
                throw new Error('1003')
            } 
            if (ticket.status == 2) 
                throw new Error('1005')
            // 当前处理人
            let current_handler = ticket.current_handler
            if (current_handler && playload_user_id != current_handler) 
                throw new Error('1006')
            if (current_handler == handler) 
                throw new Error('1007')
            current_handler = handler
            
            // 相关人员
            let relative_staff = ticket.relative_staff ? ticket.relative_staff : ''
            if (relative_staff) {
                let arr = relative_staff.split(',')
                arr.push(handler)
                relative_staff = utils.uniqueArr(arr).join(',')        
            } else {
                relative_staff = handler
            }

            // 处理列表
            let process_list = ticket.process_list ? JSON.parse(ticket.process_list) : [],
                new_process_list,
                process_item = {
                    from: playload_user_id,
                    to: handler,
                    desc,
                    attachment
                }
            process_list.push(process_item)
            new_process_list = JSON.stringify(process_list)

            // 处理时间
            let update_time = utils.dateFormat('yyyy-MM-dd',new Date())
            // 状态处理中
            let status = 1
            let sqlArr = [
                Number(status),
                update_time,
                new_process_list,
                relative_staff,
                current_handler,
                Number(ticket_id)
            ]
            let resultMsg = await updateTicket(sqlArr)
            res.send({
                code: 0,
                msg: resultMsg
            })
        } catch(err){
            console.log(err.message)
            let errObj = {
                '1002':'没有此工单',
                '1003':'该工单已删除',
                '1004':'工单更新失败',
                '1005':'该工单已结束，不能再修改',
                '1006':'你无权指派工单',
                '1007':'工单不能指派给自己'
            }
            if (errObj[err.message]) {
                res.send({
                    code: err.message,
                    msg: errObj[err.message]
                })
            }
        }
    },
    // 删除工单
    deleteTicket: async (req,res)=>{
        /**
         * 权限
         */
        let ticket_id = req.body.ticket_id
        try {
            let ticketResult = await getTicketById(ticket_id)
            if (ticketResult.del_flag === 2) {
                throw new Error('1003')
            }
            await model.deleteTicket([2,ticket_id]).then((results)=>{
                if (results.affectedRows === 1) {
                    res.send({
                        code: 0,
                        msg: 'ok'
                    })
                } else {
                    throw new Error('1004')
                }
            })
        }catch(err){
            console.log('deleteTicketErr: ',err)
            let errObj = {
                '1002':'没有此工单',
                '1003':'请勿重复删除',
                '1004':'工单删除失败',
            }
            if (errObj[err.message]) {
                res.send({
                    code: err.message,
                    msg: errObj[err.message]
                })
            }
        }

    },
    // 完成工单
    completeTicket: async (req,res)=>{
        let {
            ticket_id, 
            handler,
            desc, 
            attachment, 
            playload_user_id
        } = req.body
        try {
            let ticket = await getTicketById(ticket_id)
            if (ticket.del_flag === 2) {
                throw new Error('1003')
            } 
            if (ticket.status == 2) 
                throw new Error('1005')
                
            // 当前处理人
            let current_handler = ticket.current_handler
            if (current_handler && playload_user_id != current_handler) 
                throw new Error('1006')
            if (current_handler == handler) 
                throw new Error('1007')
            // 相关人员
            let relative_staff = ticket.relative_staff ? ticket.relative_staff : ''
            if (handler) {
                current_handler = handler
                if (relative_staff) {
                    let arr = relative_staff.split(',')
                    arr.push(handler)
                    relative_staff = utils.uniqueArr(arr).join(',')        
                } else {
                    relative_staff = handler
                }
            }
            // 处理列表
            let process_list = ticket.process_list ? JSON.parse(ticket.process_list) : [],
                new_process_list,
                process_item = {
                    from: playload_user_id,
                    to: handler ? handler: '',
                    desc,
                    attachment
                }
            process_list.push(process_item)
            new_process_list = JSON.stringify(process_list)

            // 处理时间
            let update_time = utils.dateFormat('yyyy-MM-dd',new Date())
            // 完成
            let status = 2
            let sqlArr = [
                Number(status),
                update_time,
                new_process_list,
                relative_staff,
                current_handler,
                Number(ticket_id)
            ]
            let resultMsg = await updateTicket(sqlArr)
            res.send({
                code: 0,
                msg: resultMsg
            })
        } catch(err){
            console.log(err.message)
            let errObj = {
                '1002':'没有此工单',
                '1003':'该工单已删除',
                '1004':'工单更新失败',
                '1005':'该工单已结束，不能再修改',
                '1006':'你无权指派工单',
                '1007':'工单不能指派给自己'
            }
            if (errObj[err.message]) {
                res.send({
                    code: err.message,
                    msg: errObj[err.message]
                })
            }
        }
    },
    // 工单类别列表
    getTicketCategoryList: async (req,res) =>{
        try {
            let result = await model.queryTicketCategoryList()
            console.log(result)
            res.send({
                code: 0,
                msg: 'ok',
                data:result
            })
        } catch (err) {
            console.log('getTicketdetailsErr: ',err)
        }
    }
}
// 搜索物员工
