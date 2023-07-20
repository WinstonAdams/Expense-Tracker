'use strict'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../categories')
const db = require('../../config/mongoose')

const CATEGORY = [
  { name: '家居物業', icon: 'fa-house' },
  { name: '交通出行', icon: 'fa-van-shuttle' },
  { name: '休閒娛樂', icon: 'fa-face-grin-beam' },
  { name: '餐飲食品', icon: 'fa-utensils' },
  { name: '其他', icon: 'fa-pen' },
]

db.once('open', () => {
  Category.create(CATEGORY)
    .then(() => {
      console.log('Add category seeds done!')
      process.exit()
    })
    .catch(err => console.log(err))
    .finally(() => db.close())
})