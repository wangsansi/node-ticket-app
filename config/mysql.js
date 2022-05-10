// 连接数据库
const mysql = require('mysql')

const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  port     : '3306',
  password : '数据库密码',
  database : '数据库名称',
  dateStrings: true  //将时间转换为字符串
});
   
connection.connect();

module.exports = connection
