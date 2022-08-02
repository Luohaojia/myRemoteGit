const express = require('express')
const cors = require('cors')
const stuRouter = require('./router/student')
//服务器实例
const app = express()

//配置中间件
app.use(cors())
app.use(express.urlencoded({ extended: false }))

//  封装res.send函数
app.use((req, res, next) => {
  res.chucuo = (err, status = 1) => {
    res.send({
      status: status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

//配置路由  并配置访问前缀
app.use('/student', stuRouter)

//启动服务器
app.listen(8888, () => {
  console.log('服务器启动！ http://127.0.0.1:8888')
})
