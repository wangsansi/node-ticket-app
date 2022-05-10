//连接数据库
const connection  = require("../../config/mysql")

// let createTable = function(){
//     return query(sql, [])
// }

let query = function(sql,value){
    console.log('数据库开始')
    console.log('[sql]',sql)
    console.log('[value]',value)
    return new Promise((resolve, reject)=>{
        connection.query(sql, value, (error, results, fields)=>{
            if (error) {
                reject(error.message);
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = query