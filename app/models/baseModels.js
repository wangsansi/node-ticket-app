
const query = require('./index')
let queryUserLogin = function(value){
    let _sql = `select * from user where name=? and password=?;`
    return query(_sql, value)
}

let queryResidentInfo = function(id){
    let _sql = `select * from resident where user_id=${id};`
    return query(_sql, id)
}

let insertUser = function(value){
    let _sql = `insert into user set name=?, password=?;`
    return query(_sql, value)
}

let insertResidentInfo = function(value){
    let _sql = "insert into resident set user_id=?, name=?, mobile=?, identity_num=?, resident_type=?, proprietor_remark=?, building_num=?, apartment_num=?, room_num=?, create_time=?;"
    return query(_sql, value)
}
let updateResidentCommitteeInfo = function(value){
    let _sql = "update resident set is_committee=? where user_id=?"
    return query(_sql, value)
}
let updateBackstageAuth = function(value){
    let _sql = "update user set backstage_auth=? where user_id=?"
    return query(_sql, value)
}

let insertEmployeeInfo = function(value){
    let _sql = "insert into employee set user_id=?, job_num=?, name=?, mobile=?, identity_num=?, dept_id=?, position_id=?, create_time=?;"
    return query(_sql, value)
}
let insertPropertyManagementDepartment = function(value){
    let _sql = "insert into propertyManagementDepartment set name=?, leader=?, leader_id=?, mobile=?;"
    return query(_sql, value)
}
let queryPmDepartmentList = function(){
    let _sql = "select id,name,leader_id from propertyManagementDepartment"
    return query(_sql)
}
let queryPmDepartmentDetailById  = function(id){
    let _sql = `select leader_id from propertyManagementDepartment where id=${id}`
    return query(_sql)
}
let insertPropertyManagementPosition = function(value){
    let _sql = "insert into propertyManagementPosition set name=?;"
    return query(_sql, value)
}
let insertCommitteeInfo = function(value){
    let _sql = "insert into committee set user_id=?,position_id=?;"
    return query(_sql, value)
}
let insertCommitteePosition = function(value){
    let _sql = "insert into committeePosition set name=?;"
    return query(_sql, value)
}

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
    query,
    queryUserLogin,
    insertResidentInfo,
    queryResidentInfo,
    insertEmployeeInfo,
    insertPropertyManagementDepartment,
    queryPmDepartmentList,
    queryPmDepartmentDetailById,
    insertPropertyManagementPosition,
    insertCommitteeInfo,
    insertCommitteePosition,
    updateResidentCommitteeInfo,
    updateBackstageAuth,
    insertUser,
}

