const { AnswerModel } = require('./db/model.js')
const postAnswer = require('./resolvers.js')
const { logger } = require('./middlewares/logger.js')

const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
} = require('graphql')

const answerTypeGql = {
  id: { type: GraphQLID },
  email: { type: GraphQLNonNull(GraphQLString) },
  autres_libs: { type: new GraphQLList(GraphQLString) },
  connaissance_db: { type: new GraphQLList(GraphQLString) },
  connaissance_db_expert: { type: new GraphQLList(GraphQLString) },
  containers_bool: { type: GraphQLString },
  containers_liste: { type: GraphQLString },
  demo_administration: { type: GraphQLString },
  demo_age: { type: GraphQLString },
  demo_entree_admin: { type: GraphQLString },
  demo_etudiant: { type: GraphQLString },
  demo_fonctions: { type: GraphQLString },
  demo_plus_hautes_etudes: { type: GraphQLString },
  demo_rythme: { type: GraphQLString },
  demo_status: { type: GraphQLString },
  demo_titre: { type: GraphQLString },
  editeur_principal: { type: new GraphQLList(GraphQLString) },
  experience_programmation: { type: GraphQLInt },
  frameworks_web: { type: new GraphQLList(GraphQLString) },
  language_expert: { type: new GraphQLList(GraphQLString) },
  language_pas_expert: { type: new GraphQLList(GraphQLString) },
  os_principal: { type: new GraphQLList(GraphQLString) },
  plateformes_os: { type: new GraphQLList(GraphQLString) },
  premiere_ligne_code: { type: GraphQLInt },
  profils_tech: { type: GraphQLInt },
  programmation_pro: { type: GraphQLInt },
  recherche_travail: { type: GraphQLString },
  recherche_travail_secteur: { type: GraphQLString },
  recherches_info: { type: GraphQLString },
  recherches_info_texte: { type: GraphQLString },
  satisfaction: { type: GraphQLInt },
  taille_structure: { type: GraphQLString },
  travail_activite: { type: GraphQLString },
  travail_activite_autre: { type: new GraphQLList(GraphQLString) },
  travail_bureau_domicile: { type: GraphQLString },
  demo_genre: { type: GraphQLString },
}

const AnswerType = new GraphQLObjectType({
  name: 'Answer',
  fields: answerTypeGql,
})

const AnswerInputType = new GraphQLInputObjectType({
  name: 'AnswerInput',
  fields: answerTypeGql,
})

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
