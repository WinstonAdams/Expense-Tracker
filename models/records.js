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
  userId: {
    type: Schema.Types.objectId,
    ref: 'User',
    index: true,
    require: true,
  },
  categoryId: {
    type: Schema.Types.objectId,
    ref: 'Category',
    index: true,
    require: true,
  }
})

module.exports = mongoose.model('Record', recordSchema)