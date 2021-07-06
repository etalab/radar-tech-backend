
const createType = require('mongoose-schema-to-graphql')
const { GraphQLList } = require('graphql')
const logger = require('../utils/logger.js')
const { postAnswer } = require('../controllers/answer.js')

module.exports = (metier) => {
  const obj = require(`../db/metiers/${metier}.js`)
  // Creer les types
  const config = {
    name: metier,
    description: `${metier} base schema`,
    class: 'GraphQLObjectType',
    schema: obj[`${metier}Schema`],
    exclude: ['_id'],
  }
  const type = createType(config)

  config.class = 'GraphQLInputObjectType'
  config.name = `${metier}Input`
  const inputType = createType(config)

  // creer une requête
  const query = {
    type: GraphQLList(type),
    resolve: () => {
      return obj[`${metier}Model`].find().exec()
        .catch(err => {
          logger.error(`An error occured in ${metier} querry ${err}`)
          return err
        })
    },
  }

  const args = {}
  args.answer = { type: (inputType) }
  // Create une mutation
  const mutation = {
    type: type,
    args: args,
    resolve: async (_, args) => {
      console.log(args)
      return postAnswer(metier, args.answer)
        .catch(err => {
          logger.error(`An error occured in createAnswer mutation ${err}`)
          return err
        })
    },
  }
  return { query, mutation, type, inputType }
}
