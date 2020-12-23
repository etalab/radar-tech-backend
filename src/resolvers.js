const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

let body = {
  "sender":{  
    "name":"Audrey from RadarTech",
    "email":"audrey.bramy@data.gouv.fr"
  },
  "to":[  
    {  
      "email":"audrey.bramy@gmail.com",
      "name":"Audrey Bramy"
    }
  ],
  "subject":"Validation de votre participation au Radar Tech",
  "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Sendinblue.</p></body></html>"
}

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

const sendEmail = () => apiInstance.sendTransacEmail(body).then(function(data) {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

module.exports = sendEmail;