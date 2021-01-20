var questionnaire = require('./questionnaire.js')
var fs = require('fs')

let mongoSchemaStr = 'const mongoSchema = {\n' +
` email: {
    type: String,
    required: true,
    unique: true
  },
  emailHash: {
    type: String,
    required: true
  },
  salt: String,
  confirm_email: {
    type: String,
    required: true,
    default: false
  },
  email_sent: {
    type: String,
    required: true,
    default: false
  }, \n`;

let answerTypeGqlStr = `
const {
	GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");

const answerTypeGql = {
  id: { type: GraphQLID },
  email: { type: GraphQLNonNull(GraphQLString) },\n`;

const pages = questionnaire.pages;
pages.forEach(page => {
	page.elements.forEach(element => {
    const attributName = element["name"];
    if (element["isReqired"] !== undefined && element["isReqired"] == true) {
      mongoSchemaStr += `  ${attributName}: {
				  type: String,
				  required: true
        }, 
      \n`;
      answerTypeGqlStr += ` ${attributName}: { type: GraphQLNonNull(GraphQLString) }, \n`;
		} else {
      mongoSchemaStr += `  ${attributName}: String, \n`;
      answerTypeGqlStr += `  ${attributName}: { type: GraphQLString }, \n`
		}
  });
});

fs.writeFile('./src/mongoSchema.js', mongoSchemaStr + '}; \n\n module.exports = mongoSchema;', (err) => {
  if (err) throw err;
  console.log('mongoSchema.js has been saved!');
});

fs.writeFile('./src/graphqlSchema.js', answerTypeGqlStr + '}; \n\n module.exports = answerTypeGql;', (err) => {
  if (err) throw err;
  console.log('graphqlSchema.js has been saved!');
});
