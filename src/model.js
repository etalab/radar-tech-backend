const mongoose = require("mongoose");
const mongoSchema = require("./mongoSchema.js");
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/radarTechDB';

// no user needed locally but we need it for the prod environment 
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const AnswerModel = mongoose.model("answer", mongoSchema);

const confirmEmail = async (emailHash) => {
  // update confirm_email attribute
  const condition = { emailHash }
  , update = { confirm_email: true}
  , options = { multi: false };

  return updateAnswer(condition, update, options);
}

const updateEmailSent = async (emailHash, sent) => {
  // update email_sent attribute
  const condition = { emailHash }
  , update = { email_sent: sent}
	, options = { multi: false };

  return updateAnswer(condition, update, options);
}

const updateAnswer = async (condition, update, options) => {
  return await AnswerModel.updateOne(condition, update, options)
  .then(data => data)
  .catch(e => {
    console.log(e);
    return e;
  });
}

module.exports = { AnswerModel, confirmEmail, updateEmailSent };