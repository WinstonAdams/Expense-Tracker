'use strict'

const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

// 進入新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增支出
router.post('/', (req, res) => {
  const UserId = req.user._id
  const { name, date, category, amount } = req.body

  Category.findOne({ name: category })
    .lean()
    .then(categoryItem => {
      const CategoryId = categoryItem._id

      Record.create({
        name,
        date,
        amount,
        UserId,
        CategoryId
      })
        .then(() => res.redirect('/'))
        .catch(error => {
          console.log(error)
          res.render('errorPage', { errorMsg: error.message })
        })
    })
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

// 進入修改頁面
router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  const UserId = req.user._id

  Record.findOne({ _id, UserId })
    .lean()
    .then(record => {
      Category.findOne({ _id: record.CategoryId })
        .lean()
        .then(category => {
          const categoryName = category.name
          const date = record.date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
          res.render('edit', { record, date, categoryName })
        })
        .catch(error => {
          console.log(error)
          res.render('errorPage', { errorMsg: error.message })
        })
    })
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

// 修改支出
router.put('/:id', async (req, res) => {
  const _id = req.params.id
  const UserId = req.user._id
  const { name, date, category, amount } = req.body

  Category.findOne({ name: category })
    .lean()
    .then(categoryItem => {
      const CategoryId = categoryItem._id

      Record.findOne({ _id, UserId })
        .then(record => {
          record.name = name
          record.date = date
          record.amount = amount
          record.CategoryId = CategoryId
          return record.save()
        })
        .then(() => res.redirect('/'))
        .catch(error => {
          console.log(error)
          res.render('errorPage', { errorMsg: error.message })
        })
    })
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

// 刪除
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const UserId = req.user._id

  Record.findOne({ _id, UserId })
    .then(record => record.deleteOne())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

module.exports = router