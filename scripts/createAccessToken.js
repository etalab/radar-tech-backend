const createAccessToken = require('../src/utils/createAccessToken.js')

/** get arguments
 * process.argv[0]: user name
 * process.argv[0]: user role
 */
const myArgs = process.argv.slice(2)
createAccessToken(myArgs[0], myArgs[1], myArgs[1])
  .then(token => console.log(token))
  .catch(err => console.log(err))
