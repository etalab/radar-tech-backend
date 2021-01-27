# Projet RadarTech
## Objectif 
Nous proposons de consolider  un questionnaire  et de le soumettre aux milliers d'agents concernés via un site web dédié, puis de produire une page avec les des résultats obtenus. La DINUM ne souhaite par recourir à des outils de sondage classique car elle vise uneaccessibilité maximale et une expérience utilisateur propre à ce site, tant pour les questionsque pour la présentation des résultats.

Le présent projet est le *backend* de l'application. Les frontend, développé en React avec Gatsby est disponible dans [un autre projet](https://github.com/etalab/radar-tech-frontend).
## Outils Utilisés
- graphql
- nodejs
- mongodb

## Pré-requis
- Node 14
- npm 6

# Développement
Ajouter les variables nécessaire en prenant exemple sur le fichier `.env.exemple` et en le renommant en `.env`.
Lancer l'application : 
`npm test`
L'application est lancé sur le port 3001.
[Un client graphql est disponible.](https://localhost:3001/graphql)

# DOKKU
## Créer ou mettre à jour une application
1. Ajouter un fichier Procfile
Le fichier contient la commande nécessaire pour lancer l'application : 
`web: node src/app.js`
Ajouter le fichier et enregistrer
`$ git add Profile / git commit -m "add procfile"`
3. Créer des variables d'environnement
`$ export DOKKU_HOST='studio-01.infra.data.gouv.fr'`
`$ export DOKKU_PORT='22'`
2. Vérifier que les variables sont à jour :
`$ env | grep DOKKU`
3. Cloner le repo en local
4. Déployer l'application
    a. Créer une nouvelle app
    Créer l'application dans le dossier du projet :
    `$ dokku apps:create <nom_app>`
    un remote Dokku est ajouté pointant sur le dépôt distant
    b. Mettre a jour une application existante
    Ajouter le dépôt dokku en local :
    `$ git remote add dokku dokku@studio-01.infra.data.gouv.fr:<nom_app>`

5. Ajoute la variable d'environnement API_URL
`$ dokku config:set <app_name> API_URL=<app_url>`
5. Pousser la branche
`$ git push dokku master`
Ou 
`$ git push dokku <nom_branche>:master` pour pousser une autre branche
-> résulat : un lien http pour accéder à l'application

Note : 
- /!\ Le client dokku en local infère le nom de l'application à partir du nom de remote.
- Pour pouvoir effectuer ces opérations sur le serveur Etalab il est nécessaire d'avoir partagé votre clé ssh à l'un des administrateurs.

## Variables d'environnement nécessaires : 
```
API_URL:               <à ajouter manuellement>
DOKKU_APP_RESTORE:     1 // par défault
DOKKU_APP_TYPE:        herokuish // par défault
DOKKU_PROXY_PORT:      80 // par défault
DOKKU_PROXY_PORT_MAP:  http:80:5000 // par défault
GIT_REV:               99b3316454abea522684d6807294927579991faf // par défault
MONGO_URL:             <ajouté automatiquement par dokku>
```

## Créer une base de données 
`$ dokku mongo:add <db_name>`
Lié à l'application
`$ dokku mongo:link <db_name> <app_namme>`
Ajoute automatiquement la variable __MONGO_URL__ dans les variables d'environnement dokku.

## Logs
Pour voir les logs : `$ dokku logs <nom_app> --tail`

# GRAPHQL 
Les requêtes suivantes sont celles autorisées actuellement
## Ajouter une réponse
### Mutation
```
mutation CreateAnswer ($answer: AnswerInput) {
  	createAnswer(answer: $answer) {
      email
    }
  }
```
### Variable
```
{
  "answer": {
  "email": "<a unique valid email>",
  "demo_age": "<age>"
}
}
```

## Ajouter plusieurs réponses
### Mutation
```
mutation CreateMultipleAnswer($answerList: [AnswerInput]) {
  createMultipleAnswer(answerList: $answerList) {
    demo_age
    email
  }
}
```
### Variable
```
{
  "answerList": [
    {
      "email": "aaa@fdfdfs.fr",
      "demo_age": "30-45"
    },
    {
      "email": "bbb@fdfdfs.fr",
      "demo_age": "45-60"
    }
  ]
}
```

## Accèder aux réponses 
```
{
  answer {
    email,
    demo_age,
    demo_genre,
    education_formation
  }
}
```

# Mongo
`$ use radarTechDB`
Find All 
`$ db.answers.find()`
Remove all (only for dev)
`$ db.answers.remove( { } )`

# Mettre à jour le modèle de données
Mettre à jour le fichier questionnaire.js avec le nouveau questionnaire.
Exécuter le script `./scripts/createSchema.js`.
Les fichiers `./src/graphqlSchema.js` et `./src/mongoSchema.js` seront mis à jour.