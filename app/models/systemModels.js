
const query = require('./index')

// let insertPropertyDept = function(value){
//     let _sql = "insert into propertyManagementDepartment set name=?, leader=?, leader_id=?, mobile=?;"
//     return query(_sql, value)
// }
// let insertPropertyPosition = function(value){
//     let _sql = "insert into propertyManagementPosition set name=?;"
//     return query(_sql, value)
// }
// let insertCommitteePosition = function(value){
//     let _sql = "insert into committeePosition set name=?;"
//     return query(_sql, value)
// }
// let insertResident = function(value){
//     let _sql = "insert into resident set user_id=?, name=?, mobile=?, identity_num=?, resident_type=?, proprietor_remark=?, building_num=?, apartment_num=?, room_num=?, create_time=?;"
//     return query(_sql, value)
// }
// let insertCommitteeMember = function(value){
//     let _sql = "insert into committee set user_id=?,position_id=?;"
//     return query(_sql, value)
// }

// let queryResidentById = function(id){
//     let _sql = `select * from resident where user_id=${id};`
//     return query(_sql, id)
// }


let queryPropertyDeptList = function() {
    let _sql = "select id,name,leader_id from propertyManagementDepartment where del_flag=0;"
    return query(_sql)
}
let queryPropertyDeptDetails = function(id) {
    let _sql = `select * from propertyManagementDepartment where id=${id} and del_flag=0;`
    return query(_sql)
}
let updatePropertyDeptList = function(value){
    let _sql = `update propertyManagementDepartment set leader_id=?, leader=?, phone=? where id=?;`
    return query(_sql, value)
}
let queryPropertyPositionList = function() {
    let _sql = "select id,name from propertyManagementPosition where del_flag=0;"
    return query(_sql)
}
let queryCommitteeMemberDetails = function(id){
    let _sql = `SELECT com.user_id,red.name,red.mobile,pos.name FROM committee AS com, resident AS red,committeePosition AS pos WHERE com.user_id = red.user_id AND com.position_id = pos.id and com.del_flag=0 and com.user_id=${id};`
    return query(_sql)
} 

let queryPropertyEmployeeList = function(value) {
    if (!value.pageSize) {
        let _sql = `SELECT SQL_CALC_FOUND_ROWS employee.user_id,employee.name,sex,mobile,job_num,dept_id,propertyManagementDepartment.name dept_name,position_id,propertyManagementPosition.name position_name FROM employee,propertyManagementDepartment,propertyManagementPosition WHERE propertyManagementDepartment.id = employee.dept_id and propertyManagementPosition.id = employee.position_id and employee.del_flag=0 and employee.remark='${value.remark}';`
        return query(_sql)
    }
    let _sql = `SELECT SQL_CALC_FOUND_ROWS employee.user_id,employee.name,sex,mobile,job_num,dept_id,propertyManagementDepartment.name dept_name,position_id,propertyManagementPosition.name position_name FROM employee,propertyManagementDepartment,propertyManagementPosition WHERE propertyManagementDepartment.id = employee.dept_id and propertyManagementPosition.id = employee.position_id and employee.del_flag=0 and employee.remark='${value.remark}' limit ${value.pageSize} offset ${value.pageIndex};`
    return new Promise((resolve, reject)=>{
        query(_sql).then((list)=>{
            let sql = `SELECT FOUND_ROWS()`
            query(sql).then((totle)=>{
                let obj = {}
                obj.list = list,
                obj.totle = totle[0]['FOUND_ROWS()']
                resolve(obj)
            }, err=>{
                reject(err)
            })
        },err => {
            resolve(err)
        })
    })
}
let queryPropertyEmployeeDetails = function(id) {
    let _sql = `SELECT employee.user_id,employee.name,sex,identity_num,remark,mobile,job_num,dept_id,propertyManagementDepartment.name dept_name,position_id,propertyManagementPosition.name position_name FROM employee,propertyManagementDepartment,propertyManagementPosition WHERE propertyManagementDepartment.id = employee.dept_id and propertyManagementPosition.id = employee.position_id and employee.del_flag=0 and employee.user_id=${id};`
    return query(_sql)
}
let queryPropertyEmployeeName = function(id_str) {
    let _sql = `select user_id,name FROM employee where user_id in (${id_str})`
    return query(_sql)
}
let queryPropertyEmployeeLeader  = function(id){
    let _sql = `select leader_id from propertyManagementDepartment where id=${id}`
    return query(_sql)
}
module.exports = {
    // insertPropertyDept,
    // insertPropertyPosition,
    // insertCommitteePosition,
    // insertResident,
    // insertCommitteeMember,
    // queryResidentById, 
    queryPropertyDeptList,
    queryPropertyDeptDetails,
    updatePropertyDeptList,
    queryPropertyPositionList,
    queryCommitteeMemberDetails,
    queryPropertyEmployeeList,
    queryPropertyEmployeeDetails,
    queryPropertyEmployeeName,
    queryPropertyEmployeeLeader
}