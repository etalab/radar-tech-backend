const { AnswerModel, UserModel, updateEmailSent } = require('./db/model.js')
const { logger } = require('./middlewares/logger.js')
const { createSalt, createHash } = require('./utils/helpers.js')

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

const sendEmail = async (answer) => {
  const body = {
    sender: {
      name: 'Audrey from RadarTech',
      email: 'audrey.bramy@data.gouv.fr',
    },
    to: [
      {
        email: `${answer.email}`,
      },
    ],
    subject: 'Validation de votre participation au Radar Tech 2021',
    htmlContent: `<html><head></head><body><p>Cliquez sur <a href="${API_URL}/confirmEmail?hash=${answer.emailHash}">ce lien</a> pour valider votre participation au questionnaire.</p></body></html>`,
    textContent: `Cliquez sur ce lien : ${API_URL}/confirmEmail?hash=${answer.emailHash}, pour valider votre participation au questionnaire.`,
  }

  return apiInstance.sendTransacEmail(body)
    .then(_ => {
      logger.info('sendEmail: Email has been sent.')
      updateEmailSent(answer.emailHash, true)
      return answer
    })
    .catch(e => e.error)
}

const postAnswer = async (answerData) => {
  const newAnswer = answerData
  try {
    const salt = createSalt()
    const res = createHash(newAnswer.email, salt)
    newAnswer.salt = salt
    newAnswer.emailHash = res.hash
    logger.info(`EmailHash created ${res.hash}`)
    const answer = AnswerModel.create(newAnswer)
    logger.info(`postAnswer: A new answer has correctly been inserted in database. EmailHash is ${answer.emailHash}`)
    const result = await sendEmail(answer)
    logger.info(`postAnswer: Email has been sent. EmailHash is ${result.emailHash}`)
    return result
  } catch (err) {
    logger.error(`postAnswer: An error occured during postAnswer function ${err}`)
    throw err
  }
}

const createUser = (username, password, role) => {
  try {
    const salt = createSalt()
    const passwordHashed = createHash(password, salt)
    const userData = { username, password: passwordHashed, salt, role }
    const user = UserModel(userData)
    return user.save()
  } catch (err) {
    logger.error(`createUser: An error occured during createUser function ${err}`)
    throw err
  }
}

const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    UserModel.find({ username })
      .then(users => {
        if (password === null) {
          reject(new Error('password is required'))
        }
        if (users.length === 0) {
          reject(new Error("this user doesn't exist"))
        }
        const user = users[0]
        if (user.password === null || user.salt === null) {
          reject(new Error('password, salt and hash are required to compare'))
        }
        const passwordHashed = createHash(password, user.salt)
        console.log(passwordHashed)
        console.log(user.password)
        if (passwordHashed === user.password) {
          resolve(user)
        } else {
          reject(new Error("password doesn't correspond to the user password"))
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = { postAnswer, createUser, loginUser }
