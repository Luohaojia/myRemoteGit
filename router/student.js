const express = require('express')
const db = require('../dataBase/db')
//路由实例
const router = express.Router()

//获取学生信息
router.get('/getStu', (req, res) => {
  const sql = 'select * from studentlist where is_delete=0'
  db.query(sql, (err, results) => {
    //执行sql语句失败
    if (err) return res.chucuo(err)
    res.send({
      status: 0,
      message: '获取列表成功！',
      data: results
    })
  })
})

//添加学生
router.post('/addStu', (req, res) => {
  //先查询
  const sql = 'select * from studentlist where name=? and sex=? and major=?'
  db.query(sql, [req.body.name, req.body.sex, req.body.major], (err, results) => {
    if (err) res.chucuo(err)

    //若有“同名同性别同专业的学生”（看看原数据集中是否存在相同的数据（可能他的is_delete=1））
    if (results.length === 1) {
      //根据is_delete判断是否被删除，0表示被删除
      if (results[0].is_delete === 1) {
        const sql1 = 'update studentlist set is_delete=0 where name=? and sex=? and major=?'
        db.query(sql1, [results[0].name, results[0].sex, results[0].major], (err, results) => {
          if (err) res.chucuo(err)
          res.send({
            status: 0,
            message: '添加学生成功！'
          })
        })
      } else {
        res.chucuo('已存在该学生！请勿重复添加！')
      }
      return
    }

    //添加学生
    const sql2 = 'insert into studentlist set ?'
    db.query(sql2, req.body, (err, results) => {
      if (err) res.chucuo(err) //同名但不同专业性别会被拦截

      // sql语句执行成功，但影响不等于1
      if (results.affectedRows !== 1) res.chucuo('添加失败！')
      res.send({
        status: 0,
        message: '添加学生成功！'
      })
    })
  })
})

//删除学生
router.get('/delStu/:id', (req, res) => {
  const sql = 'update studentlist set is_delete=1  where id=?'
  db.query(sql, req.params.id, (err, results) => {
    //执行sql语句失败
    if (err) res.chucuo(err)
    //sql语句执行成功，但影响不等于1
    if (results.affectedRows !== 1) res.chucuo('删除失败！')
    res.send({
      status: 0,
      message: '删除学生成功！'
    })
  })
})

//将路由对象共享出去
module.exports = router
