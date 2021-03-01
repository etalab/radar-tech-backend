const crypto = require("crypto");
const { AnswerModel, updateEmailSent } = require("./db/model.js");
const { logger } = require('./middlewares/logger.js');
require('dotenv').config();

let API_URL = process.env.API_URL;
if (API_URL === undefined) {
  const PORT = process.env.PORT || 3001;
  const HOST = process.env.HOST || 'http://localhost';
  API_URL = `${HOST}:${PORT}`;
}

const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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
  .then(_ => {
    logger.info(`sendEmail: Email has been sent.`);
    updateEmailSent(answer.emailHash, true);
    return answer;
  })
  .catch(e => e.error);
}

function createSaltAndHash(email) {
  return new Promise((success, failure)=> {
    crypto.randomBytes(16, (err, salt) => {
      if (err) throw failure(err);
      const hash = crypto.pbkdf2Sync(email, salt.toString('hex'), 1000, 32, `sha512`).toString('hex');
      success({salt, hash});
    });
  }); 
}

const postAnswer = async (answer) => {
  let newAnswer = answer; 
  return createSaltAndHash(newAnswer.email)
  .then(res => {
    newAnswer["salt"] = res.salt;
    newAnswer["emailHash"] = res.hash;
    logger.info(`EmailHash created ${res.hash}`);
    return AnswerModel.create(newAnswer);
  })
  .then(result => {
    logger.info(`postAnswer: A new answer has correctly been inserted in database. EmailHash is ${result.emailHash}`);
    return sendEmail(result);
  })
  .then(result => {
    logger.info(`postAnswer: Email has been sent. EmailHash is ${result.emailHash}`);
    return result;
  })
  .catch(err => {
    logger.error(`postAnswer: An error occured during postAnswer function ${err}`);
    return err;
  });
}

module.exports = postAnswer;