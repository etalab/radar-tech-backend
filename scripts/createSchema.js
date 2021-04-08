const fs = require('fs')

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

const createSchema = (questionnaire) => {
  const metier = questionnaire.metier
  let mongoSchemaStr = `const ${metier} = {
  email: {
    type: String,
    required: true,
    unique: true,
  },\n`
  return new Promise((resolve, reject) => {
    const importList = 'const mongoose = require(\'mongoose\')\n\n'
    questionnaire.pages.forEach(page => {
      page.elements.forEach((element, i) => {
        const name = element.name
        const type = 'String'
        if (element.type === 'matrix') {
          let object = `const Object${i} = new mongoose.Schema({\n`
          element.rows.forEach(row => {
            object += `  ${row.replace(' ', '')}: String,\n`
          })
          object += '})\n'
          mongoSchemaStr = object + mongoSchemaStr
          mongoSchemaStr += createAttribute(name, `Object${i}`)
        } else {
          mongoSchemaStr += createAttribute(name, type)
        }
      })
    })

    let strToFile = importList + mongoSchemaStr + '}\n\n'
    strToFile += `const ${metier}Schema = mongoose.Schema(${metier})\n`
    strToFile += `const ${metier}Model = mongoose.model('${metier}', ${metier})\n`
    strToFile += `module.exports = { ${metier}Schema, ${metier}Model }\n`

    fs.writeFile(`../src/db/metiers/${metier}.js`, strToFile, (err) => {
      if (err) { reject(err) }
      resolve(true)
    })
  })
}

const jsonFilePath = process.argv[2]
const rawdata = fs.readFileSync(jsonFilePath)
const questionnaire = JSON.parse(rawdata)

createSchema(questionnaire)
  .then(_ => console.log('DONE'))
  .catch(err => console.log(err))
