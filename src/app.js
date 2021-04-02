const Express = require('express')
const { graphqlHTTP } = require('express-graphql')
const cors = require('cors')
const { formatError } = require('graphql/error')
const { confirmEmail } = require('./db/model.js')
const { httpLogger, logger } = require('./middlewares/logger.js')
const auth = require('./middlewares/auth.js')
const graphqlSchema = require('./graphql/graphqlSchema.js')
const createAccessToken = require('./utils/createAccessToken.js')
require('dotenv').config()

const app = Express()

// Http Logger middleware: it will log all incoming HTTP requests information
app.use(httpLogger)

app.use(cors())
// Here we are configuring express to use body-parser as middle-ware.
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.use(
  '/graphql',
  auth,
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
    customFormatErrorFn: (err) => {
      logger.error(JSON.stringify({ message: err.message, location: err.location, path: err.path }))
      return formatError(err)
    },
  }),
)

app.get('/', (_, res) => {
  res.send('Hello, Dokku!')
})

app.get('/confirmEmail', async (req, res) => {
  const hash = req.query.hash
  return await confirmEmail(hash)
    .then(() => res.status(200).send('Merci, votre participation a été confirmée.'))
    .catch(e => {
      logger.error(`an error occured during mail confirmation: ${e}`)
      return res.status(500).end()
    })
})

app.post('/token', async (req, res) => {
  const body = req.body
  const username = body.username
  const password = body.password
  if (username === undefined || username === '') {
    const errorMsg = 'Username is required to create token'
    logger.error(errorMsg)
    return res.status(500).send({ error: errorMsg }).end()
  }
  if (password === undefined || password === '') {
    const errorMsg = 'Password is required to create token'
    logger.error(errorMsg)
    return res.status(500).send({ error: errorMsg }).end()
  }
  createAccessToken(username, password)
    .then(token => res.json({ token }))
    .catch(err => {
      const errorMsg = `An error occured trying to create token: ${err}`
      logger.error()
      return res.status(500).send({ error: errorMsg }).end()
    })
})

// Listen
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logger.info(`server is running at ${PORT}`)
})
