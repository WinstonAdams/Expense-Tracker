'use strict'

const express = require('express')
const router = express.Router()
const Record = require('../../models/records')
const Category = require('../../models/categories')

router.get('/', async (req, res) => {
  const UserId = req.user._id
  const categoryList = await Category.find().lean()

  Record.find({ UserId })
    .lean()
    .then(records => {
      const recordList = records.map(record => {
        const category = categoryList.find(category => { return category._id.toString() === record.CategoryId.toString() })
        record.icon = category.icon
        record.date = record.date.toLocaleString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })
        return record
      })

      let totalAmount = 0
      recordList.forEach(record => {
        totalAmount += record.amount
      })

      res.render('index', { recordList, totalAmount })
    })
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

router.get('/filter', (req, res) => {
  const categoryFiltered = req.query.category
  const UserId = req.user._id

  Category.findOne({ name: categoryFiltered })
    .lean()
    .then(category => {
      const CategoryId = category._id
      const categoryIcon = category.icon

      Record.find({ UserId, CategoryId })
        .lean()
        .then(records => {
          const recordList = records.map(record => {
            record.icon = category.icon
            record.date = record.date.toLocaleString()
            return record
          })

          let totalAmount = 0
          recordList.forEach(record => {
            totalAmount += record.amount
          })

          res.render('index', { recordList, totalAmount, categoryFiltered })
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

module.exports = router