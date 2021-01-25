const mongoSchema = {
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
  }, 
  autres_libs: [String],
    connaissance_db: [String],
    connaissance_db_expert: [String],
    containers_bool: String,
    containers_liste: String,
    'containers_list-Comment': String,
    demo_administration: String,
    demo_age: String,
    demo_entree_admin: String,
    demo_etudiant: String,
    demo_fonctions: String,
    demo_plus_hautes_etudes: String,
    demo_rythme: String,
    demo_status: String,
    demo_titre: String,
    editeur_principal: [String],
    //education_formation: yup.object(),
    //education_formation_autres: yup.object(),
    experience_programmation: Number,
    frameworks_web: [String],
    language_expert: [String],
    language_pas_expert: [String],
    os_principal: [String],
    plateformes_os: [String],
    premiere_ligne_code: Number,
    profils_tech: Number,
    programmation_pro: Number,
    recherche_travail: String,
    recherche_travail_secteur: String,
    recherches_info: String,
    recherches_info_texte: String,
    satisfaction: Number,
    taille_structure: String,
    travail_activite: String,
    travail_activite_autre: [String],
    travail_bureau_domicile: String,
    demo_genre: String,
    email: String,
}; 

 module.exports = mongoSchema;