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
  demo_etudiant: String, 
  education_formation: String, 
  demo_plus_hautes_etudes: String, 
  education_formation: String, 
  recherches_info: String, 
  panel1: String, 
  premiere_ligne_code: String, 
  experience_programmation: String, 
  programmation_pro: String, 
  language_pas_expert: String, 
  language_expert: String, 
  frameworks_web: String, 
  autres_libs: String, 
  connaissance_db: String, 
  connaissance_db_expert: String, 
  plateformes_os: String, 
  containers_bool: String, 
  panel2: String, 
  os_principal: String, 
  editeur_principal: String, 
  travail_bureau_domicile: String, 
  taille_structure: String, 
  profils_tech: String, 
  satisfaction: String, 
  recherche_travail: String, 
  recherche_travail_secteur: String, 
}; 

 module.exports = mongoSchema;