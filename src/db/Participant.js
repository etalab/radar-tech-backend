const mongoose = require('mongoose')

const participantSchema = {
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
  metier: {
    type: String,
    required: true,
    default: false,
  },
}

const participantModel = mongoose.model('participant', mongoose.Schema(participantSchema))
module.exports = participantModel
