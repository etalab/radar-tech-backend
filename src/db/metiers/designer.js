const mongoose = require('mongoose')

const designer = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  demo_genre: String,
  demo_age: String,
  demo_titre: String,
  demo_fonctions: String,
  demo_administration: String,
  demo_status: String,
  demo_rythme: String,
  travail_activite: String,
  travail_activite_autre: String,
  demo_entree_admin: String,
}

const designerSchema = mongoose.Schema(designer)
const designerModel = mongoose.model('designer', designer)
module.exports = { designerSchema, designerModel }
