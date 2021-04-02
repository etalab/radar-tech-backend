const crypto = require('crypto')

// Move this function in an other file
const createHash = (toHash, salt) => {
  console.log(toHash)
  console.log(salt)
  return crypto.pbkdf2Sync(toHash, Buffer.from(salt, 'binary'), 1000, 32, 'sha512').toString('hex')
}

// how to make a good salt ??
const createSalt = () => {
  return crypto.randomBytes(16).toString('hex')
}

module.exports = { createHash, createSalt }
