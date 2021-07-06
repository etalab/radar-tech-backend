const { updateEmailSent } = require('./participant.js')
const { createSalt, createHash } = require('../utils/helpers.js')
const logger = require('../utils/logger.js')

require('dotenv').config()

let API_URL = process.env.API_URL
if (API_URL === undefined) {
  const PORT = process.env.PORT || 3001
  const HOST = process.env.HOST || 'http://localhost'
  API_URL = `${HOST}:${PORT}`
}

const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.SIB_API_KEY

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

const sendEmail = async (participant) => {
  const body = {
    sender: {
      name: 'Audrey from RadarTech',
      email: 'audrey.bramy@data.gouv.fr',
    },
    to: [
      {
        email: `${participant.email}`,
      },
    ],
    subject: 'Validation de votre participation au Radar Tech 2021',
    htmlContent: `<html><head></head><body><p>Cliquez sur <a href="${API_URL}/confirmEmail?hash=${participant.emailHash}">ce lien</a> pour valider votre participation au questionnaire.</p></body></html>`,
    textContent: `Cliquez sur ce lien : ${API_URL}/confirmEmail?hash=${participant.emailHash}, pour valider votre participation au questionnaire.`,
  }

  return apiInstance.sendTransacEmail(body)
    .then(_ => {
      logger.info('sendEmail: Email has been sent.')
      updateEmailSent(participant.emailHash, true)
      return participant
    })
    .catch(e => {
      logger.error(`An error occured in sendTransacEmail: ${e.error}`)
      return e.error
    })
}

const postAnswer = async (metier, answerData) => {
  const obj = require(`./db/metiers/${metier}.js`)
  const participant = require('./db/Participant.js')
  const model = obj[`${metier}Model`]
  const newAnswer = answerData
  const newParticipant = { email: newAnswer.email, metier }
  try {
    const salt = createSalt()
    const hash = createHash(newAnswer.email, salt)
    newParticipant.salt = salt
    newParticipant.emailHash = hash
    newAnswer.email = hash
    logger.info(`EmailHash created ${hash}`)
    await model.create(newAnswer)
      .then(_ => participant.create(newParticipant))
      .then(participant => {
        logger.info(`postAnswer: A new answer has correctly been inserted in database. EmailHash is ${participant.emailHash}`)
        return sendEmail(participant)
      })
      .then(result => {
        logger.info(`postAnswer: Email has been sent. EmailHash is ${result.emailHash}`)
        return result
      })
  } catch (err) {
    logger.error(`postAnswer: An error occured during postAnswer function ${err}`)
    throw err
  }
}

module.exports = { postAnswer }
