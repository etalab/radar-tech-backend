const createSchema = require('./createSchema.js')
const fs = require('fr')
// const { logger } = require('../src/middlewares/logger.js'
// const exec = require('child_process').exec

const jsonFilePath = process.argv[2] // ou provenant d'un fichier de config
console.log(jsonFilePath)
const rawdata = fs.readFileSync(jsonFilePath)
const questionnaire = JSON.parse(rawdata)

/**
 *
 * Déploiement automatisé à tester avec git workflow?
 *
 * deploy
    existing_app: if false execute apps:create
    app_name: if undefine create a random ? of get the random name returned by apps:create
    dokku_host : default 'studio-01.infra.data.gouv.fr'
    dokku_port : default 22

    .then(_ => {
        const DEPLOY = questionnaire.deploy
        if (deploy !== 'undefined' && deploy === 'dokku') {
            const HOST = deploy.dokky_host | 'studio-01.infra.data.gouv.fr'
            const PORT = deploy.dokky_port | 22
            let cmd = `export DOKKU_HOST=${HOST} | export DOKKU_PORT=${PORT}`
            exec(cmd, (err, stdout, stderr) => {
                if(err) {
                    throw stderr
                }
                return stdout
            })
        }
    })
    .then(_ => {
        // A REVOIR
        const APP_NAME = deploy.app_name | ''
        const cmd = `dokku apps:create ${APP_NAME} |
        exec(cmd, (err, stdout, stderr) => {
            if(err) {
                throw stderr
            }
            return stdout
        })

    })
*/

createSchema(questionnaire)
  .then(_ => console.log('DONE'))
  .catch(err => console.log(err))
