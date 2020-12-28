const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/radarTechDB';
console.log(MONGO_URL);

// no user needed locally but we need it for the prod environment 
mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const AnswerModel = mongoose.model("answer", {
	email: String,
	emailHash: String,
	salt: String,
	demo_age: String,
	demo_genre: String,
	education_formation: String,
	confirm_email: Boolean
});

module.exports = AnswerModel;