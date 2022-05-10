const query = require('./index')

let queryUserLogin = function(value){
    let _sql = `select * from user where name=? and password=?;`
    return query(_sql, value)
}
let queryUserAdminAuth = function(id){
    let _sql = `select is_admin from user where user_id=${id};`
    return query(_sql)
}
let queryUserExist = function(name) {
    let _sql = `select * from user where name='${name}';`
    return query(_sql)
}
let updateUserAdmin = function(name) {
    let _sql = `update user set is_admin=1 where name='${name}';`
    return query(_sql)
}
let queryResidentInfo = function(id){
    let _sql = `select * from resident where user_id=${id};`
    return query(_sql, id)
}

let queryEmployeeInfo  = function(id){
    let _sql = `select * from employee where user_id=${id};`
    return query(_sql, id)
}

let insertUser = function(value){
    let _sql = `insert into user set name=?, password=?,is_employee=?;`
    return query(_sql, value)
}
let queryUserId = function(){
    return query(`SELECT LAST_INSERT_ID()`)
}
// 注册插入员工
let insertPropertyEmployee = function(value){
    let _sql = "insert into employee set user_id=?, job_num=?, name=?, sex=?, mobile=?, identity_num=?, dept_id=?, position_id=?, create_time=?, remark=?;"
    return query(_sql, value)
}
let updatePropertyEmployee = function(value){
    let _sql = `update employee set job_num=?, name=?, sex=?, mobile=?, identity_num=?, dept_id=?, position_id=?, update_time=?, remark=? where user_id=?;`
    return query(_sql, value)
}
let updateEmployeeStatus = function(id){
    let _sql = `update employee set remark='审核通过' where user_id=${id};`
    return query(_sql)
}
// let updateResidentCommitteeInfo = function(value){
//     let _sql = "update resident set is_committee=? where user_id=?"
//     return query(_sql, value)
// }

// let updateBackstageAuth = function(value){
//     let _sql = "update user set admin_auth=? where user_id=?"
//     return query(_sql, value)
// }




// let queryPmDepartmentDetailById  = function(id){
//     let _sql = `select leader_id from propertyManagementDepartment where id=${id}`
//     return query(_sql)
// }




// let users =
//     `create table if not exists users(
//      id INT NOT NULL AUTO_INCREMENT,
//      name VARCHAR(100) NOT NULL,
//      password VARCHAR(100) NOT NULL,
//      mobile VARCHAR(100) NOT NULL,
//      moment VARCHAR(100) NOT NULL,
//      PRIMARY KEY ( id )
//     );`

// createTable(users)

module.exports = {
    queryUserId,
    queryUserLogin, 
    queryUserExist, 
    queryResidentInfo, 
    queryEmployeeInfo,
    queryUserAdminAuth,
    updateUserAdmin,
    // queryPmDepartmentDetailById,
    // updateResidentCommitteeInfo,
    // updateBackstageAuth,
    insertUser,
    insertPropertyEmployee,
    updatePropertyEmployee,
    updateEmployeeStatus
}

