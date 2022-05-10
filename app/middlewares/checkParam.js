let Joi = require('joi')
const system = '/admin/v1/system'
const ticket = '/admin/v1/ticket'
const user = '/admin/v1/user'
const cos = '/api/v1/cos'

const pageParmas = {
    pageSize: Joi.number().required(),
    pageIndex: Joi.number().required(),
}
// cos获取签名
const getAuthorizationSchema = {
    Method: Joi.string().required(),
    Pathname: Joi.string().required(),
}
// 获取cos存储桶
const getBucketInfoSchema = {
    playload_user_id: Joi.number().required()
}
// 管理站注册
const adminRegisterSchema = {
    user_name: Joi.string().required(),
    password: Joi.string().required()
}
// 管理站登录
const adminLoginSchema = {
    user_name: Joi.string().required(),
    password: Joi.string().required()
}
// 管理站添加管理员
const adminAddSchema = {
    user_name: Joi.string().required(),
    password: Joi.string().required()
}
// 管理站绑定物业人员
const addEmployeeSchema = {
    job_num: Joi.string().pattern(/^\d{4}$/).required(),
    name: Joi.string().required(),
    mobile: Joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/).required(),
    identity_num: Joi.string().required(),
    dept_id: Joi.number().required(),
    position_id: Joi.number().required(),
    sex: Joi.number().valid(0,1).required(),
    remark: Joi.string().required(),
    playload_user_id: Joi.number().required()
}
// 管理站审核物业人员时修改人员信息
const updateEmployeeSchema = Object.assign(
    {},
    addEmployeeSchema,
    {user_id: Joi.number().required()}
)
// 查物业人员列表
const selectEmployeeListSchema = {
    type:Joi.number().valid(1,2).required(),
    remark:Joi.number(),
    playload_user_id: Joi.number().required(),
    pageSize: Joi.number(),
    pageIndex: Joi.number(),
}
const selectAdminAuthSchema = {
    user_id: Joi.number().required(),
    playload_user_id: Joi.number().required()
}
const selectEmployeeDetailsSchema = {
    user_id: Joi.number().required(),
    playload_user_id: Joi.number().required()
}
const selectPropertyDeptDetailsSchema = {
    id: Joi.number().required(),
    playload_user_id: Joi.number().required()
}
const selectPropertyDeptListSchema = {
    playload_user_id: Joi.number().required()
}
const selectPropertyPositionDetailsSchema = {
    id: Joi.number().required(),
    playload_user_id: Joi.number().required()
}
const selectPropertyPositionListSchema = {
    playload_user_id: Joi.number().required()
}
// const addResidentSchema = {
//     name: Joi.string().required(),
//     mobile: Joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/).required(),
//     identity_num: Joi.string().required(),
//     resident_type: Joi.string().pattern(/^(0|2){1,1}$/).required(), // 0,2数字,
//     proprietor_remark: Joi.string().pattern(/^(0|1){1,1}$/).required(), // 0,1数字,
//     building_num: Joi.string().required(),
//     apartment_num: Joi.string().required(),
//     room_num: Joi.string().required(),
//     playload_user_id: Joi.number().required()
// }
// const addPropertyManagementDepartmentSchema = {
//     name: Joi.string().required(),
//     leader: Joi.string().required(),
//     leader_id: Joi.number().required(),
//     phone: Joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/).required(),
//     category_list: Joi.string(),
//     playload_user_id: Joi.number().required()
// }
// const addPropertyManagementPositionSchema = {
//     name: Joi.string().required(),
//     playload_user_id: Joi.number().required()
// }
// const addCommitteeSchema = {
//     user_id: Joi.number().required(),
//     name: Joi.string().required(),
//     position_id: Joi.number().required(),
//     playload_user_id: Joi.number().required()
// }
// const addCommitteePositionSchema = {
//     name: Joi.string().required(),
//     playload_user_id: Joi.number().required()
// }
const addTicketSchema = {
    title:Joi.string().required(),
    content:Joi.string().required(),
    attachment:Joi.string(),
    category:Joi.number(),
    playload_user_id: Joi.number().required()
}
const transferTicketSchema = {
    ticket_id: Joi.number().required(),
    handler: Joi.number().required(),
    //handler: Joi.number().valid(18,35)
    desc: Joi.string().required(),
    attachment:Joi.string(),
    playload_user_id: Joi.number().required()
}
const completeTicketSchema = {
    ticket_id: Joi.number().required(),
    handler: Joi.number(),
    //handler: Joi.number().valid(18,35)
    desc: Joi.string().required(),
    attachment:Joi.string(),
    playload_user_id: Joi.number().required()
}
const selectTicketsListSchema = Object.assign(
    {},
    {
        type:Joi.number().valid(1,2).required(),
        status: Joi.number().valid(0,1,2),
        current_handler:Joi.number(),
        relative_staff:Joi.number(),
        creator_id:Joi.number(),
        dept_id:Joi.number(),
        time_scope:Joi.array(),
        title: Joi.string(),
        playload_user_id: Joi.number().required()
    },
    pageParmas
)
const selectTicketDetailsSchema = {
    playload_user_id: Joi.number().required(),
    ticket_id: Joi.number().required()
}
const distributeTicketSchema = {
    playload_user_id: Joi.number().required(),
    dept_id:Joi.number().required(),
    category_id:Joi.number().required(),
    ticket_id: Joi.number().required()
}
const deleteTicketSchema = {
    playload_user_id: Joi.number().required(),
    ticket_id: Joi.number().required()
}

const selectcategoryListSchema = {
    playload_user_id: Joi.number().required()
}
let checkParam = (req, res, next)=>{
    let data = Object.assign({},req.body,req.query)
    console.log('data: ', data)
    console.log('req.path: ',req.path)
    let paramSchema
    
    if (req.path === `${system}/property/employee/list`) paramSchema = selectEmployeeListSchema
    if (req.path === `${system}/property/employee/details`) paramSchema = selectEmployeeDetailsSchema
    if (req.path === `${system}/property/dept/list`) paramSchema = selectPropertyDeptListSchema
    if (req.path === `${system}/property/dept/details`) paramSchema = selectPropertyDeptDetailsSchema
    if (req.path === `${system}/property/position/list`) paramSchema = selectPropertyPositionListSchema
    if (req.path === `${system}/property/position/details`) paramSchema = selectPropertyPositionDetailsSchema
    if (req.path === `${system}/menu`) paramSchema = selectAdminAuthSchema
    
    if (req.path === `${user}/register`) paramSchema = adminRegisterSchema
    if (req.path === `${user}/login`) paramSchema = adminLoginSchema
    if (req.path === `${user}/admin/add`) paramSchema = adminAddSchema
    if (req.path === `${user}/property/employee/add`) paramSchema = addEmployeeSchema
    if (req.path === `${user}/property/employee/update`) paramSchema = updateEmployeeSchema

    if (req.path === `${cos}/authorization`) paramSchema = getAuthorizationSchema
    if (req.path === `${cos}/bucketInfo`) paramSchema = getBucketInfoSchema

    if (req.path === `${ticket}/create`) paramSchema = addTicketSchema
    if (req.path === `${ticket}/transfer`) paramSchema = transferTicketSchema 
    if (req.path === `${ticket}/complete`) paramSchema = completeTicketSchema
    if (req.path === `${ticket}/list`) paramSchema = selectTicketsListSchema
    if (req.path === `${ticket}/details`) paramSchema = selectTicketDetailsSchema
    if (req.path === `${ticket}/distribute`) paramSchema = distributeTicketSchema
    if (req.path === `${ticket}/category`) paramSchema = selectcategoryListSchema
    if (req.path === `${ticket}/delete`) paramSchema = deleteTicketSchema
    
    if (!paramSchema) {
        next()
        return
    }
    let schema = Joi.object(paramSchema);
    let result = schema.validate(data)
    console.log('joi.result',result)
    if (result.error) {
        res.send({
            code: '10004',
            msg: '参数错误'
        })
        return
    }
    console.log('joi参数验证通过')
    next()
}

module.exports = checkParam