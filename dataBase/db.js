const mysql = require('mysql')

//创建数据库连接对象
const db = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'admin123',
  database: 'mydb1'
})

module.exports = db
