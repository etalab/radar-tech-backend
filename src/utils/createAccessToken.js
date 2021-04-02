const { loginUser } = require('../resolvers.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createAccessToken = (username, password) => {
  return new Promise((resolve, reject) => {
    loginUser(username, password)
      .then(user => {
        console.log(user)
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

module.exports = createAccessToken
