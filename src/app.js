const Express = require("express");
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose");

const {
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLType,
	GraphQLSchema,
	GraphQLNonNull,
	GraphQLObjectType,
} = require("graphql");

var app = Express();
var cors = require("cors");

// no user needed locally but we need it for the prod environment 
// mongoose.connect('mongodb://localhost:27017/radarTechDB', { useNewUrlParser: true });
mongoose.connect('mongodb://fast-snow-hulu:a4bf6ea0fcb3183e7810a0bb0fa962d3@dokku-mongo-fast-snow-hulu:27017/fast_snow_hulu', { useNewUrlParser: true });

const AnswerModel = mongoose.model("answer", {
	age: String,
	email: String,
	gender: String,
	pro_domain: String
});

const AnswerType = new GraphQLObjectType({
	name: "Answer",
	fields: {
		id: { type: GraphQLID },
		email: { type: GraphQLString },
		age: { type: GraphQLString },
		gender: { type: GraphQLString },
		pro_domain: { type: GraphQLString },
	}
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
		name: "Create",
		fields: {
			answer: {
				type: AnswerType,
				args: {
					age: { type: GraphQLString },
					email: { type: GraphQLNonNull(GraphQLString)},
					gender: { type: GraphQLString },
					pro_domain: { type: GraphQLString },
				},
				resolve: (root, args, context, info) => {
					var answer = new AnswerModel(args);
					return answer.save();
				}
			}
		}
	})
});

// ROUTES
app.use(cors())
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