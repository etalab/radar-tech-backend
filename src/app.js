const Express = require("express");
const { graphqlHTTP } = require('express-graphql'); 
const cors = require("cors");
const bodyParser = require("body-parser");
const { formatError } = require('graphql/error');
const { confirmEmail } = require("./db/model.js");
const {httpLogger, logger } = require('./middlewares/logger.js');
const auth = require("./middlewares/auth.js");
const graphqlSchema = require("./graphqlSchema.js")
require('dotenv').config();

var app = Express();

// Auth middleware to securize API access
app.use(auth);

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
    schema: graphqlSchema,
		graphiql: true,
		customFormatErrorFn: (err) => {
			logger.error(JSON.stringify({"message": err.message, "location": err.location, "path": err.path}));
			return formatError(err);
		}
  }),
);

// Listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	logger.info(`server is running at ${PORT}`);
});