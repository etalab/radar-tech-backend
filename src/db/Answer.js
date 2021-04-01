import mongoose from 'mongoose'

const Object3 = new mongoose.Schema({
  Row4: String,
  Row5: String,
})

const Object2 = new mongoose.Schema({
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
  demo_genre: String,
  demo_age: String,
  question1: Object2,
  question2: Object3,
  demo_etudiant: String,
}

export default answerSchema
