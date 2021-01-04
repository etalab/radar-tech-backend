const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/radarTechDB';

// no user needed locally but we need it for the prod environment 
mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const AnswerModel = mongoose.model("answer", {
	email: {
		type: String,
		required: true,
		unique: true
	},
	emailHash: {
		type: String,
		required: true
	},
	salt: String,
	demo_age: String,
	demo_genre: String,
	education_formation: String,
	confirm_email: {
		type: Boolean,
		default: false
	},
	email_sent: {
		type: Boolean,
		default: false
	}
});

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