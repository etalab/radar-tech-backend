const Express = require("express");
const { graphqlHTTP } = require('express-graphql'); 
const cors = require("cors");
const bodyParser = require("body-parser");
const postAnswer = require("./resolvers.js");
const { AnswerModel, confirmEmail } = require("./model.js");
const answerTypeGql = require("./graphqlSchema.js");
require('dotenv').config();

const {
	GraphQLID,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLBoolean
} = require("graphql");

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
				args: {
					answer: { type: (AnswerInputType) }
				},
				resolve: async (root, args, context, info) => {
					return postAnswer(args["answer"]);
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
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, Dokku!');
});

app.get('/confirmEmail', async (req, res) => {
	let hash = req.query.hash;
	return await confirmEmail(hash)
	.then(() => res.status(200).send('Merci, votre participation a été confirmée.'))
	.catch(e => {
		console.log(`an error occured during mail confirmation: ${e}`);
		return res.status(500).end();
	})
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);

// Listen
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, () => {
	console.log(`server is running at ${PORT}`);
});