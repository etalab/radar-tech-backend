const Express = require("express");
const { graphqlHTTP } = require('express-graphql'); 
const cors = require("cors");
const bodyParser = require("body-parser");
const postAnswer = require("./resolvers.js");
const { AnswerModel, confirmEmail } = require("./model.js");
const logger = require('./logger.js');
const httpLogger = require('./middlewares.js');
const answerTypeGql = require("./graphqlSchema.js");
require('dotenv').config();

const {
	GraphQLID,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLInputObjectType
} = require("graphql");
const { formatError } = require('graphql/error');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

var app = Express();

/*const answerTypeGql = {
	id: { type: GraphQLID },
	email: { type: GraphQLNonNull(GraphQLString) },
	demo_age: { type: GraphQLString },
	demo_genre: { type: GraphQLString },
	education_formation: { type: GraphQLString }
}*/

const AnswerType = new GraphQLObjectType({
	name: "Answer",
	fields: answerTypeGql
});

const AnswerInputType = new GraphQLInputObjectType({
	name: "AnswerInput",
	fields: answerTypeGql
});

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "Query",
		fields: {
			// get answer list stored id db
			answer: {
				type: GraphQLList(AnswerType),
				resolve: (root, args, context, info) => {
					return AnswerModel.find().exec()
					.then(res => res)
					.catch(err => {
						logger.error(`An error occured in answer querry ${err}`);
						return err;
					});
				}
			},
			// get an answer by id
			answerByID: {
				type: AnswerType,
				args: {
					// strong validation for graphqlid, which is mendatory for running this query
					id: { type: GraphQLNonNull(GraphQLID) }
				},
				resolve: (root, args, context, info) => {
					return AnswerModel.findById(args.id).exec()
					.then(res => res)
					.catch(err => {
						logger.error(`An error occured in answerByID querry ${err}`);
						return err;
					});
				}
			},
		}
	}),
	// Create Mutation
	mutation: new GraphQLObjectType({
		name: "Mutation",
		fields: {
			createAnswer: {
				type: AnswerType,
				args: {
					answer: { type: (AnswerInputType) }
				},
				resolve: async (root, args, context, info) => {
					return postAnswer(args["answer"])
					.then(newAnswer => newAnswer)
					.catch(err => {
						logger.error(`An error occured in createAnswer mutation ${err}`);
						return err;
					});
				}
			},
			createMultipleAnswer: {
				type: GraphQLList(AnswerType),
				args: {
					answerList: { type: GraphQLList(AnswerInputType) }
				},
				resolve: async (root, args, context, info) => {
					return await AnswerModel.collection.insertMany(args["answerList"])
					.then(res => res["ops"])
					.catch(err => {
						logger.error(err);
						return err;
					});
				}
			}
		}
	})
});

// Http Logger middleware: it will log all incoming HTTP requests information
app.use(httpLogger);

app.use(cors())
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send('Hello, Dokku!');
});

app.get('/confirmEmail', async (req, res) => {
	let hash = req.query.hash;
	return await confirmEmail(hash)
	.then(() => res.status(200).send('Merci, votre participation a été confirmée.'))
	.catch(e => {
		logger.error(`an error occured during mail confirmation: ${e}`);
		return res.status(500).end();
	})
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
		graphiql: true,
		customFormatErrorFn: (err) => {
			logger.error(JSON.stringify({"message": err.message, "location": err.location, "path": err.path}));
			return formatError(err);
		}
  }),
);

// Listen
app.listen(PORT, () => {
	logger.info(`server is running at ${PORT}`);
});