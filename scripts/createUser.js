const { createSalt, createHash } = require('../src/utils/helpers.js')

/** get arguments
 * process.argv[0]: password to hash
 */
const myArgs = process.argv.slice(2)
console.log(createHash(myArgs[1], createSalt()))

// Excecute this script
// connect to the dokku mongo db as admin user
// create un new user with the following command
// dokku mongo:connect <service_name>
// > use <db_name>
// > db.users.insertOne({ "username": "audrey1725", "password":"7451e81bde0de5044108280f55fb70e490631158f665c064c20ce6c10b188880", "salt":"51197606910af6012ceb52b56626f0ab", "role":"dev" })
// lancer l'app
// npm run dev
// tester via l'api

// db.users.insert({ username: 'audrey1851', salt: 'a4f5c5a9b48ba11c971238ee49affff4', password: 'ad1dc3dc0812ec8f29e73b96dfdc90594746c30d4b28fff7e790ac57cbed1c06', role: 'dev' })
