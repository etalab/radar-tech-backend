const { createSalt, createHash } = require('../src/utils/helpers.js')

/** get arguments
 * process.argv[0]: password to hash
 */
const myArgs = process.argv.slice(2)
const salt = createSalt()
console.log(`Salt: ${salt}`)
console.log(`Hash: ${createHash(myArgs[1], salt)}`)
