'use strict'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')
const User = require('../users')
const Category = require('../categories')
const Record = require('../records')
const db = require('../../config/mongoose')

const USER = {
  name: "user1",
  email: "user1@example.com",
  password: "123456789"
}


const RECORD = [
  {
    name: '午餐',
    amount: 60,
    category: '餐飲食品',
  },
  {
    name: '晚餐',
    amount: 60,
    category: '餐飲食品',
  },
  {
    name: '捷運',
    amount: 120,
    category: '交通出行',
  },
  {
    name: '電影：驚奇隊長',
    amount: 220,
    category: '休閒娛樂',
  },
  {
    name: '租金',
    amount: 25000,
    category: '家居物業',
  },
]

db.once('open', async () => {
  const categories = await Category.find().lean()
  let recordSeed = RECORD.map(record => {
    const category = categories.find(category => { return category.name === record.category })
    record.CategoryId = category._id
    delete record.category
    return record
  })

  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(USER.password, salt))
    .then(hash => User.create({
      name: USER.name,
      email: USER.email,
      password: hash,
    }))
    .then(user => {
      recordSeed = recordSeed.map(record => {
        record.UserId = user._id
        return record
      })
      return Record.create(recordSeed)
    })
    .then(() => {
      console.log('Add record seeds done!')
      process.exit()
    })
    .catch(err => console.log(err))
    .finally(() => db.close())
})