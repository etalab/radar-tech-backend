const mongoose = require('mongoose')

const Object2 = new mongoose.Schema({
  Row1: String,
  Row2: String,
})

const mongoSchema = {
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
  demo_genre: String,
  demo_age: String,
  question1: Object2,
  demo_etudiant: String,
}

module.exports = mongoSchema
