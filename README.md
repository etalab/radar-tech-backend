# Projet RadarTech
## Objectif 
...
## Pré-requis
- nodejs
- mongodb

# Développement

# DOKKU
## Backend
1. Créer des variables d'environnement
-> vérifier env|grep DOKKU

export DOKKU_HOST='studio-01.infra.data.gouv.fr'
export DOKKU_PORT='22'
export DOKKU_GIT_REMOTE='dokku'

2. Cloner le repo en local
3. dans le dossier du repo lancer 
`dokku apps:create`
4. Push la branche principale
Crée un app
Une image docker avec toutes les dépendances du projet
-> résulat un lien http pour accéder à l'application

### Dans mon projet express/nodejs: 
Ajouter un procfile 
git add / git commit
git push sur master met à jour l'application

## Base de données
Le plugin mongodb existe déjà
Sur la doc du plugin en question ou dokku mongo
dokku mongo:create <nom> 

## Frontend
dokku config : liste les variables enregistrées 
dokku config:set VARIABLE_NAME=VALUE
quand on configure une nouvelle variable il redemmare l'app
On va créer une variable pour configurer la communication avec le back
faire le lien entre les deux conteneurs
avec la lib os on peut récupérer ces variables

état de l'app dokku:ps inspect <app-name>
dokku ps:stop <app-name>

    dokku logs --tail


dokku config:set fast-snow-hulu DOKKU_PROXY_PORT_MAP=http:80:5000
dokku config:set fast-snow-hulu NPM_CONFIG_PRODUCTION=false

# GraphQL
## Mutation Côté Client
 `mutation CreateAnswer ($age: String, $email: String!, $gender: String, $pro_domain: String) {
    answer(age: $age, email: $email, gender: $gender, pro_domain: $pro_domain) {
        id,
        age,
        email
    }
  }`

Exemple de données : 
`
{
  "age": "20-30",
  "email": "test2@test.fr",
  "gender": "femme",
  "pro_domain": "ingé info"
}
`



