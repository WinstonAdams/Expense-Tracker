'use strict'

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('../../models/users')

router.get('/login', (req, res) => {

  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'Email 、 Password 與 Confirm Password 必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  // 若 errors 陣列中有元素時
  if (errors.length) {
    // errors 傳給 register，再傳給 message
    return res.render('register', { errors, name, email, password, confirmPassword })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        return res.render('register', { errors, name, email, password, confirmPassword })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, email, password: hash }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
    .catch(error => {
      console.log(error)
      res.render('errorPage', { errorMsg: error.message })
    })
})

module.exports = router