'use strict'

const express = require('express')
const router = express.Router()

const Record = require('../../models/records')
const Category = require('../../models/categories')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const UserId = req.user._id
  const { name, date, category, amount } = req.body

  Category.find({ name: category })
    .lean()
    .then(categoryItem => {
      const CategoryId = categoryItem[0]._id

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

module.exports = router