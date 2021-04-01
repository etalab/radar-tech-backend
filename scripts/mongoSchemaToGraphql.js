const createType = require('mongoose-schema-to-graphql')
const mongoose = require('mongoose')
const answerSchema = require('./schema/answer.js')
const postAnswer = require('../src/resolvers.js')
const { logger } = require('../src/middlewares/logger.js')
const { formatError } = require('graphql/error')
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/radarTechDB'
// no user needed locally but we need it for the prod environment
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql')

const AnswerSchema = mongoose.Schema(answerSchema)
const AnswerModel = mongoose.model('answer', answerSchema)

const config = {
  name: 'Answer',
  description: 'Answer base schema',
  class: 'GraphQLObjectType',
  schema: AnswerSchema,
  exclude: ['_id'],
}
const AnswerType = createType(config)

config.class = 'GraphQLInputObjectType'
config.name = 'AnswerInput'
const AnswerInputType = createType(config)

const graphqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
    // get answer list stored id db
      answer: {
        type: GraphQLList(AnswerType),
        resolve: () => {
          return AnswerModel.find().exec()
            .catch(err => {
              logger.error(`An error occured in answer querry ${err}`)
              return err
            })
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createAnswer: {
        type: AnswerType,
        args: {
          answer: { type: (AnswerInputType) },
        },
        resolve: async (_, args) => {
          return postAnswer(args.answer)
            .catch(err => {
              logger.error(`An error occured in createAnswer mutation ${err}`)
              return err
            })
        },
      },
    },
  }),
})

const Express = require('express')
const { graphqlHTTP } = require('express-graphql')

const app = Express()

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
    customFormatErrorFn: (err) => {
      logger.error(JSON.stringify({ message: err.message, location: err.location, path: err.path }))
      return formatError(err)
    },
  }),
)

// Listen
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  // logger.info(`server is running at ${PORT}`)
})
