const questionnaire = require('./questionnaire.js')
const fs = require('fs')

const importList = 'const mongoose = require(\'mongoose\');\n\n'
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
  }, \n`

const createAttribute = (name, type, isRequired) => {
  if (isRequired !== undefined && isRequired === true) {
    return `  ${name}: {
        type: ${type},
        required: true
      }, 
    \n`
  } else {
    return `  ${name}: ${type}, \n`
  }
}
const pages = questionnaire.pages
pages.forEach(page => {
  page.elements.forEach((element, i) => {
    const name = element.name
    const type = 'String'
    if (element.type === 'matrix') {
      // this is an object
      let object = `const Object${i} = new mongoose.Schema({\n`
      element.rows.forEach(row => {
        object += `  "${row.replace(' ', '')}": String,\n`
      })
      object += '}); \n\n'
      mongoSchemaStr = object + mongoSchemaStr
      mongoSchemaStr += createAttribute(name, `Object${i}`)
    } else {
      mongoSchemaStr += createAttribute(name, type)
    }
  })
})

fs.writeFile('./schema/answer.js', importList + mongoSchemaStr + '}; \n\n module.exports = mongoSchema;', (err) => {
  if (err) throw err
  console.log('mongoSchema.js has been saved!')
})
