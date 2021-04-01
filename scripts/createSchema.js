const fs = require('fs')

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

let mongoSchemaStr = `
export default answerSchema = {
  email: {
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
  },\n`

module.exports = (questionnaire) => {
  return new Promise((resolve, reject) => {
    const importList = 'import mongoose from \'mongoose\';\n\n'
    questionnaire.pages.forEach(page => {
      page.elements.forEach((element, i) => {
        const name = element.name
        const type = 'String'
        if (element.type === 'matrix') {
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

    fs.writeFile('../src/db/Answer.js', importList + mongoSchemaStr + '};', (err) => {
      if (err) { reject(err) }
      resolve(true)
    })
  })
}
