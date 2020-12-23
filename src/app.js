const Express = require("express");
const { graphqlHTTP } = require('express-graphql'); 
const cors = require("cors");
const bodyParser = require("body-parser");
const sendEmail = require("./resolvers.js");
const confirmEmail = require("./confirmEmail.js");
const AnswerModel = require("./model.js");

const {
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLType,
	GraphQLInputType,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLBoolean
} = require("graphql");

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

var app = Express();

const answerTypeGql = {
	id: { type: GraphQLID },
	email: { type: GraphQLNonNull(GraphQLString) },
	demo_age: { type: GraphQLString },
	demo_genre: { type: GraphQLString },
	education_formation: { type: GraphQLString },
	confirm_email: { type: GraphQLBoolean, default: false}
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
				args: {
					answer: { type: (AnswerInputType) }
				},
				resolve: async (root, args, context, info) => {
					sendEmail();
					return await AnswerModel.collection.insertOne(args["answer"])
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
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, Dokku!');
});

const confirEmail = async (req, res) => {
	let email = req.query.email;
	console.log(email);
	await confirmEmail(email)
	.then(res.send(`confirm ${email}`))
	.catch(e => {
		console.log(`an error occured during mail confirmation ${e}`);
		return res.status(500).end();
	})
};

app.get('/confirmEmail', confirEmail);

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