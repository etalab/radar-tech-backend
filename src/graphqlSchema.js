
const {
	GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,

} = require("graphql");

// new GraphQLList(PersonType)

const answerTypeGql = {
  id: { type: GraphQLID },
  email: { type: GraphQLNonNull(GraphQLString) },
  autres_libs: { type: new GraphQLList(GraphQLString) },
  connaissance_db: { type: new GraphQLList(GraphQLString) },
  connaissance_db_expert: { type: new GraphQLList(GraphQLString) },
  containers_bool: { type: GraphQLString },
  containers_liste: { type: GraphQLString },
  //containers_list-Comment: { type: GraphQLString },
  demo_administration: { type: GraphQLString },
  demo_age: { type: GraphQLString },
  demo_entree_admin: { type: GraphQLString },
  demo_etudiant: { type: GraphQLString },
  demo_fonctions: { type: GraphQLString },
  demo_plus_hautes_etudes: { type: GraphQLString },
  demo_rythme: { type: GraphQLString },
  demo_status: { type: GraphQLString },
  demo_titre: { type: GraphQLString },
  editeur_principal: { type: new GraphQLList(GraphQLString) },
  //education_formation: yup.object(),
  //education_formation_autres: yup.object(),
  experience_programmation: { type: GraphQLInt },
  frameworks_web: { type: new GraphQLList(GraphQLString) },
  language_expert: { type: new GraphQLList(GraphQLString) },
  language_pas_expert: { type: new GraphQLList(GraphQLString) },
  os_principal: { type: new GraphQLList(GraphQLString) },
  plateformes_os: { type: new GraphQLList(GraphQLString) },
  premiere_ligne_code: { type: GraphQLInt },
  profils_tech: { type: GraphQLInt },
  programmation_pro: { type: GraphQLInt },
  recherche_travail: { type: GraphQLString },
  recherche_travail_secteur: { type: GraphQLString },
  recherches_info: { type: GraphQLString },
  recherches_info_texte: { type: GraphQLString },
  satisfaction: { type: GraphQLInt },
  taille_structure: { type: GraphQLString },
  travail_activite: { type: GraphQLString },
  travail_activite_autre: { type: new GraphQLList(GraphQLString) },
  travail_bureau_domicile: { type: GraphQLString },
  demo_genre: { type: GraphQLString },
  email: { type: GraphQLString },
}; 

 module.exports = answerTypeGql;