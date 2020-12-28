const crypto = require("crypto");
const AnswerModel = require("./model.js");
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'http://localhost';
const API_URL = `${HOST}:${PORT}`;

const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

const sendEmail = (email, hash) => {
  console.log(`>>>>>>>> ${email}  <<<<<<`);
  const body = {
    "sender":{  
      "name":"Audrey from RadarTech",
      "email":"audrey.bramy@data.gouv.fr"
    },
    "to":[  
      {  
        "email":`${email}`,
      }
    ],
    "subject":"Validation de votre participation au Radar Tech",
    "htmlContent":`<html><head></head><body><p>Cliquez sur <a href="${API_URL}/confirmEmail?email=${email}">ce lien</a> pour valider votre participation</p></body></html>`
  };

  apiInstance.sendTransacEmail(body).then(function(data) {
    console.log('API called successfully.');
  }, function(error) {
    console.error(error.error);
  });
}

const postAnswer = async (answer) => {
  let newAnswer = answer;
  // Creating a unique salt for a particular user 
  salt = crypto.randomBytes(16).toString('hex');
  console.log(`salt ${salt}`);
  // Hashing user's salt and email with 1000 iterations, 
  hash = crypto.pbkdf2Sync(newAnswer.email, salt, 1000, 32, `sha512`).toString('hex');
  console.log(`email hashed ${hash}`);

  newAnswer["salt"] = salt;
  newAnswer["emailHash"] = hash;

  return await AnswerModel.collection.insertOne(newAnswer)
  .then(result => {
    console.log(result["ops"][0]);
    sendEmail(newAnswer.email, newAnswer.emailHash);
    return result["ops"][0];
  }).catch(err => {
    console.log(err);
    return err;
  });
}

module.exports = postAnswer;