const mongoose = require('mongoose')

const Object3 = new mongoose.Schema({
  Row1: String,
  Row2: String,
})

const answerSchema = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailHash: {
    type: String,
    required: true,
  },
  salt: String,
  confirm_email: {
    type: String,
    required: true,
    default: false,
  },
  email_sent: {
    type: String,
    required: true,
    default: false,
  },
  question2: String,
  question4: String,
  question3: String,
  question1: Object3,
}

module.exports = answerSchema
