const mongoose = require('mongoose')

const designer = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  genre: String,
  age: String,
  sitProfessionnelle: [String],
  affiliation: [String],
  anneesExperience: String,
  anneesExperienceDetail: String,
  formation: [String],
  dernierDiplome: [String],
  expertise: String,
  intituleFonction: String,
  travailFacon: String,
  travailEnEquipe: String,
  competencesPerception: String,
  competencesExploitation: String,
  besoins: String,
  travailSatisfaction: String,
  travailSatisfactionText: String,
  rechercheEmploi: String,
  rechercheEmploiText: String,
  besoinNouvellesCompetences: String,
  besoinNouvellesCompetencesText: String,
}

const designerSchema = mongoose.Schema(designer)
const designerModel = mongoose.model('designer', designer)
module.exports = { designerSchema, designerModel }
