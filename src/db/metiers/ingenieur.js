const mongoose = require('mongoose')

const Object3 = new mongoose.Schema({
  Row1: String,
  Row2: String,
})
const ingenieur = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  question15: String,
  question5: String,
  question34: String,
  question20: Object3,
}

const ingenieurSchema = mongoose.Schema(ingenieur)
const ingenieurModel = mongoose.model('ingenieur', ingenieur)
module.exports = { ingenieurSchema, ingenieurModel }
