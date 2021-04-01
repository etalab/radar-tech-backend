const createType = require('mongoose-schema-to-graphql')
const mongoose = require('mongoose')
const answerSchema = require('../db/Answer.js')
const AnswerModel = require('../db/model.js')
const postAnswer = require('../resolvers.js')
const { logger } = require('../middlewares/logger.js')

const {
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} = require('graphql')

const AnswerSchema = mongoose.Schema(answerSchema)

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

module.exports = new GraphQLSchema({
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
      // get an answer by id
      answerByID: {
        type: AnswerType,
        args: {
          // strong validation for graphqlid, which is mendatory for running this query
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve: (_, args) => {
          return AnswerModel.findById(args.id).exec()
            .catch(err => {
              logger.error(`An error occured in answerByID querry ${err}`)
              return err
            })
        },
      },
    },
  }),
  // Create Mutation
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createAnswer2: {
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
      createMultipleAnswer: {
        type: GraphQLList(AnswerType),
        args: {
          answerList: { type: GraphQLList(AnswerInputType) },
        },
        resolve: async (_, args) => {
          return await AnswerModel.collection.insertMany(args.answerList)
            .then(res => res.ops)
            .catch(err => {
              logger.error(err)
              return err
            })
        },
      },
    },
  }),
})
