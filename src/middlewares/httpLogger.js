const logger = require('../utils/logger.js')
const morgan = require('morgan')

const httpLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream: logger.stream },
)

module.exports = httpLogger
