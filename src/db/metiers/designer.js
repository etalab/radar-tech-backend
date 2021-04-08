const mongoose = require('mongoose')

const Object3 = new mongoose.Schema({
  Row1: String,
  Row2: String,
})
const designer = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  question2: String,
  question4: String,
  question3: String,
  question1: Object3,
}

const designerSchema = mongoose.Schema(designer)
const designerModel = mongoose.model('designer', designer)
module.exports = { designerSchema, designerModel }
