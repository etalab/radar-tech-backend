const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/radarTechDB'

// no user needed locally but we need it for the prod environment
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const confirmEmail = async (emailHash) => {
  // update confirm_email attribute
  const condition = { emailHash }
  const update = { confirm_email: true }
  const options = { multi: false }

  return updateAnswer(condition, update, options)
}

const updateEmailSent = async (emailHash, sent) => {
  // update email_sent attribute
  const condition = { emailHash }
  const update = { email_sent: sent }
  const options = { multi: false }

  return updateAnswer(condition, update, options)
}

const updateAnswer = async (condition, update, options) => {
  // A revoir
  /* return await ParticipantModel.updateOne(condition, update, options)
    .catch(e => {
      console.log(e)
      return e
    }) */
}

module.exports = { confirmEmail, updateEmailSent }
