const query = require('./index')
// 查工单详情
let queryTicketById = function(value){
    let _sql = `select * from ticket where id=${value};`
    return query(_sql, value)
}
// 查工单列表
let queryTicketsList = function(obj) {
    
    let _sql = 'select SQL_CALC_FOUND_ROWS * from ticket where '
    let arr = []
    if(obj.type === 1){
        arr = ['dept_id','time_scope','status','categroy_id','title']
    } else if(obj.type === 2){
        arr = ['creator_id','dept_id','time_scope','status','current_handler','relative_staff', 'categroy_id','title']
    }
    let whereList = []
    for (let key of arr) {
        if (obj[key] !== undefined) {
            if (key === 'relative_staff') {
                whereList.push(`find_in_set('${obj[key]}',${key})`)
            } else if (key === 'time_scope') {
                whereList.push(`create_time between '${obj[key][0]} 00:00:00' and '${obj[key][1]} 23:00:00'`)
            } else if (key === 'dept_id') {
                whereList.push(`dept_id=${obj[key]}`)
            } else if (key === 'title') {
                whereList.push(`title REGEXP '${obj[key]}'`)
            } else {
                whereList.push(`${key}=${obj[key]}`)
            }
        }
    }
    whereList.push('del_flag=0')
    let whereStr = whereList.join(' and ')
    _sql = _sql + whereStr
    console.log('_sql',_sql)
    _sql += ` limit ${obj.pageSize} offset ${obj.pageIndex}`
    return new Promise((resolve,reject)=>{
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
//创建工单
let insertTicket = function(value){
    let _sql = `insert into ticket set title=?, content=?,attachment=?,create_time=?,creator_id=?,creator=?,category=?;`
    return query(_sql, value)
}
//更新工单
let updateTicket = function(value){
    let _sql = "update ticket set status=?, update_time=?, process_list=?, relative_staff=?, current_handler=? where id=?"
    return query(_sql, value)
}
//分单
let updateTicketDept = function(value){
    let _sql = "update ticket set status=?, update_time=?, dept_id=?, category=?, relative_staff=?, current_handler=? where id=?"
    return query(_sql, value)
}
// 删除工单
let deleteTicket = function(value){
    let _sql = "update ticket set del_flag=? where id=?"
    return query(_sql, value)
}
// 查询工单分类列表
let queryTicketCategoryList = function(){
    let _sql = "select * from category"
    return query(_sql)
}
// 通过id查询分类名称
let queryTicketCategoryById = function(id){
    let _sql = `select name from category where category_id=${id}`
    return query(_sql)
}

module.exports = {
    query,
    insertTicket,
    queryTicketById,
    queryTicketsList,
    updateTicket,
    deleteTicket,
    updateTicketDept,
    queryTicketCategoryList,
    queryTicketCategoryById
}

