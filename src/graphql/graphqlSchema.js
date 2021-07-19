
const createGraphqlSchema = require('../utils/createGraphqlSchema.js')
const fs = require('fs')

const mongoSchemaFolder = __dirname.replace('graphql', 'db/metiers')

const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql')

const queryFields = {}
const mutationFields = {}

fs.readdirSync(mongoSchemaFolder).forEach(file => {
  if (!file.includes('.gitkeep')) {
    const metier = file.replace('.js', '')
    console.log(metier)
    const { query, mutation } = createGraphqlSchema(metier)
    queryFields[metier] = query
    mutationFields[metier] = mutation
  }
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: queryFields,
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutationFields,
  }),
})
