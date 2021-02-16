const mongoose = require("mongoose");
const answerModel = require("./Answer.js");
const userModel = require("./User.js");
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/radarTechDB';

// no user needed locally but we need it for the prod environment 
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const AnswerModel = mongoose.model("answer", answerModel);
const UserModel =  mongoose.model("user", answerModel);

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

const createUser = async (username, password) => {
  // Can't create two users with same username
  const user = await User.findOne({
    where: {
      username
    }
  });

  if (!user) {
    return null;
  }

  const { hash } = crypto.createPasswordHash(password, user.salt);
  if (hash === user.password) {
    return user;
  }
  return null;
};

module.exports = { AnswerModel, UserModel, createUser, confirmEmail, updateEmailSent };