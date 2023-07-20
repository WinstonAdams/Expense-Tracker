'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    require: true,
  },
  UserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    require: true,
  },
  CategoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true,
    require: true,
  }
})

module.exports = mongoose.model('Record', recordSchema)