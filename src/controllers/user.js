const { createSalt, createHash } = require('../utils/helpers.js')
const logger = require('../utils/logger.js')
const jwt = require('jsonwebtoken')
const User = require('../db/User.js')

const createUser = (username, password, role) => {
  try {
    const salt = createSalt()
    const passwordHashed = createHash(password, salt)
    const userData = { username, password: passwordHashed, salt, role }
    const user = User(userData)
    return user.save()
  } catch (err) {
    logger.error(`createUser: An error occured during createUser function ${err}`)
    throw err
  }
}

const createAccessToken = (username, password) => {
  return new Promise((resolve, reject) => {
    loginUser(username, password)
      .then(user => {
        const userData = { username, password: user.password }
        if (user !== undefined && user !== false) {
          userData.id = user._id
          const accessToken = jwt.sign(
            userData,
            process.env.ACCESS_TOKEN_SECRET,
            {
              algorithm: process.env.ACCESS_TOKEN_ALGORITHM,
            })
          resolve(accessToken)
        } else {
          reject(new Error(`User ${userData.username} doesn't exist`))
        }
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })
}

const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    User.find({ username })
      .then(users => {
        if (password === null) {
          reject(new Error('password is required'))
        }
        if (users.length === 0) {
          reject(new Error("this user doesn't exist"))
        }
        const user = users[0]
        console.log(user)
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

module.exports = { loginUser, createAccessToken, createUser }
