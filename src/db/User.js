const mongoose = require('mongoose')
require('dotenv').config()

const userSchema = {
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  salt: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
}

const User = mongoose.model('user', userSchema)

module.exports = User
