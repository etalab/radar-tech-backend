const fs = require('fs')

const toCamelCase = (str) => {
  return str.replace(/[^a-z][a-z]/gi, word => word.toUpperCase().replace(/[^a-z]/gi, ''))
}

const createAttribute = (name, type, isRequired) => {
  if (isRequired !== undefined && isRequired === true) {
    return `  ${name}: {
        type: ${type},
        required: true
      }, 
    \n`
  } else {
    return `  ${name}: ${type},\n`
  }
}

const emaiString = '\n  email: {\n' +
  '    type: String,\n' +
  '    required: true,\n' +
  '    unique: true,\n' +
  '  },\n'

const createSchema = (jsonFile) => {
  return new Promise((resolve, reject) => {
    const metier = toCamelCase(jsonFile.metier)
    const questionnaire = jsonFile.questionnaire
    let mongoSchemaStr = `const ${metier} = {${emaiString}`
    const importList = 'const mongoose = require(\'mongoose\')\n\n'
    questionnaire.pages.forEach(page => {
      page.elements.forEach((element, i) => {
        const {
          name,
          type,
          rows,
        } = element
        if (name !== '') {
          if (name !== 'email') {
            let attributType = 'String'
            if (type === 'matrix') {
              let object = `const Object${i} = new mongoose.Schema({\n`
              rows.forEach(row => {
                object += `  ${row.replace(' ', '')}: String,\n`
              })
              object += '})\n'
              mongoSchemaStr = object + mongoSchemaStr
              attributType = `Object${i}`
            } else if (type === 'checkbox') {
              attributType = '[String]'
            }
            mongoSchemaStr += createAttribute(toCamelCase(name), attributType)
          }
        }
      })
    })

    let strToFile = importList + mongoSchemaStr + '}\n\n'
    strToFile += `const ${metier}Schema = mongoose.Schema(${metier})\n`
    strToFile += `const ${metier}Model = mongoose.model('${metier}', ${metier})\n`
    strToFile += `module.exports = { ${metier}Schema, ${metier}Model }\n`

    resolve({ metier, strToFile })
  })
}

const writeInJson = (metier, content) => {
  return new Promise((resolve, reject) => {
    const dest = `../src/db/metiers/${metier}.js`
    fs.writeFile(dest, content, (err) => {
      if (err) { reject(err) }
      resolve(true)
    })
  })
}

const jsonFilePath = process.argv[2]
const rawdata = fs.readFileSync(jsonFilePath)
const jsonFile = JSON.parse(rawdata)

createSchema(jsonFile)
  .then(({ metier, strToFile }) => {
    return writeInJson(metier, strToFile)
  })
  .then(_ => console.log('DONE'))
  .catch(err => console.err(err))
