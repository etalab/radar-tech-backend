const crypto = require("crypto");
const { AnswerModel, confirmEmail, updateEmailSent } = require("./model.js");
require('dotenv').config();

let API_URL = process.env.API_URL;
if (API_URL === undefined) {
  const PORT = process.env.PORT || 3001;
  const HOST = process.env.HOST || 'http://localhost';
  API_URL = `${HOST}:${PORT}`;
}

console.log(`resolvers ${API_URL}`);


const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

const sendEmail = async (answer) => {
  const body = {
    "sender":{  
      "name":"Audrey from RadarTech",
      "email":"audrey.bramy@data.gouv.fr"
    },
    "to":[  
      {  
        "email":`${answer.email}`,
      }
    ],
    "subject":"Validation de votre participation au Radar Tech 2021",
    "htmlContent":`<html><head></head><body><p>Cliquez sur <a href="${API_URL}/confirmEmail?hash=${answer.emailHash}">ce lien</a> pour valider votre participation au questionnaire.</p></body></html>`,
    "textContent": `Cliquez sur ce lien : ${API_URL}/confirmEmail?hash=${answer.emailHash}, pour valider votre participation au questionnaire.`
  };

  return apiInstance.sendTransacEmail(body)
  .then(updateEmailSent(hash, true))
  .then(() => answer)
  .catch(e => {
    console.error(e.error);
    return e.error;
  });
}

const postAnswer = async (answer) => {
  let newAnswer = answer;
  // Creating a unique salt
  salt = crypto.randomBytes(16).toString('hex');
  hash = crypto.pbkdf2Sync(newAnswer.email, salt, 1000, 32, `sha512`).toString('hex');

  newAnswer["salt"] = salt;
  newAnswer["emailHash"] = hash;

  return AnswerModel.create(newAnswer)
  .then(result => sendEmail(result))
  .then(() => newAnswer)
  .catch(err => {
    console.log(err);
    return err;
  });
}

module.exports = postAnswer;