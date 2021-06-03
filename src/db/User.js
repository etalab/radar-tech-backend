const mongoose = require('mongoose')
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

const userModel = mongoose.model('user', userSchema)
module.exports = userModel
