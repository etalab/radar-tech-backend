const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userSchema = require('../src/db/User.js')
require('dotenv').config()

// connect to the database
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/radarTechDB'
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const User = mongoose.model('user', userSchema)

/** get arguments
 * process.argv[0]: user name
 * process.argv[0]: user role
 */
const myArgs = process.argv.slice(2)
const userData = { username: myArgs[0], role: myArgs[1] };

// check if the user already exists
(async () => {
  const user = await User.find(userData)
  if (user !== undefined && user.length === 0) {
    const newUser = new User(userData)
    userData.id = newUser._id
    // generate an access token
    const accessToken = jwt.sign(
      userData,
      process.env.ACCESS_TOKEN_SECRET,
      {
        algorithm: process.env.ACCESS_TOKEN_ALGORITHM,
      })

    newUser.save(function (err, doc) {
      if (err) {
        throw new Error('An error occured inserting a new user : ', err)
      }
      // return access token
      console.log(`Access Token ${accessToken}`)
      return accessToken
    })
  } else {
    throw new Error(`User ${userData.username} already exists`)
  }
})()
