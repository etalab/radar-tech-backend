const mongoose = require('mongoose')

const dataScientist = {
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
  ecolePertinente: String,
  technologiesPrincipales: String,
  methodesEtAlgos: [String],
  frameworks: [String],
  autresCompetences: String,
  publientCodesSources: String,
  competencesPerception: String,
  competencesExploitation: String,
  besoins: String,
}

const dataScientistSchema = mongoose.Schema(dataScientist)
const dataScientistModel = mongoose.model('dataScientist', dataScientist)
module.exports = { dataScientistSchema, dataScientistModel }
