const Express = require("express");
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose");

const {
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLType,
	GraphQLInputType,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLInputObjectType
} = require("graphql");

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/radarTechDB';

var app = Express();
var cors = require("cors");

// no user needed locally but we need it for the prod environment 
mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const AnswerModel = mongoose.model("answer", {
	email: String,
	demo_age: String,
	demo_genre: String,
	education_formation: String
});

const answerTypeGql = {
	id: { type: GraphQLID },
	email: { type: GraphQLNonNull(GraphQLString) },
	demo_age: { type: GraphQLString },
	demo_genre: { type: GraphQLString },
	education_formation: { type: GraphQLString },
}

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
					return AnswerModel.find().exec();
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
					return AnswerModel.findById(args.id).exec();
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
				args: answerTypeGql,
				resolve: async (root, args, context, info) => {
					return await AnswerModel.collection.insertOne(args)
					.then(result => {
						console.log(result);
						return result["ops"][0];
					}).catch(err => {
						console.log(err);
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
						console.log(err);
						return err;
					});
				}
			}
		}
	})
});

// ROUTES
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello, Dokku!');
});
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);

// Listen
app.listen(3001, () => {
	console.log("server is running at 3001");
});