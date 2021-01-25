# Projet RadarTech
## Objectif 
...
## Pré-requis
- graphql
- nodejs
- mongodb

# Développement
```
$ npm run dev
```
# DOKKU
## Backend
1. Créer des variables d'environnement
```
$ export DOKKU_HOST='studio-01.infra.data.gouv.fr'
$ export DOKKU_PORT='22'
$ export DOKKU_GIT_REMOTE='dokku'
```
Vérifier que les variables sont à jour :
```
$ env | grep DOKKU
```

2. Cloner le repo en local
3. dans le dossier du repo lancer 
```
$ dokku apps:create
```
4. Pousser la branche principale
```
$ git push dokku master
```
-> résulat un lien http pour accéder à l'application

### Variables d'environnements à définir
```
$ dokku config:set HOST=<url de l'app>
$ dokku config:set PORT=<url de l'app>
$ dokku config:set SIB_API_KEY=<clé d'API de sendin blue>
```

### Dans mon projet express/nodejs: 
Ajouter un procfile
```
$ git add / git commit
$ git push dokku master #sur master met à jour l'application
```

## Base de données

### Créer la base de données
Le plugin mongodb existe déjà
Sur la doc du plugin en question ou dokku mongo
```
$ dokku mongo:create <nom_service> 
$ dokku mongo:link <nom_service> <nom_app>
```

### Se connecter à la base 
```
$ ssh -t dokku@app.etalab.studio mongo:connect <mongo app name>
```
___mongo app name : fast-snow-hulu___


## Frontend
_notes à clarifier_
```
$ dokku config #liste les variables enregistrées 
$ dokku config:set VARIABLE_NAME=VALUE
```
quand on configure une nouvelle variable il redemmare l'app
On va créer une variable pour configurer la communication avec le back
faire le lien entre les deux conteneurs
avec la lib os on peut récupérer ces variables

```
$ dokku:ps inspect <app-name> #état de l'app 
$ dokku ps:stop <app-name>
$ dokku logs --tail
$ dokku config:set fast-snow-hulu DOKKU_PROXY_PORT_MAP=http:80:5000
$ dokku config:set fast-snow-hulu NPM_CONFIG_PRODUCTION=false
```

## Logs
Pour voir les logs 
```
$ dokku logs <nom_app> --tail
```

# GRAPHQL 
## Insert an answer
### Mutation
```
mutation CreateAnswer ($answer: AnswerInput) {
  	createAnswer(answer: $answer) {
      email
    }
  }
```
### Query Variables
```
{
  "answer": {
  "email": "<a unique valid email>",
  "demo_age": "<age>"
}
}
```

## Insert Multiple Answers
### Mutation
```
mutation CreateMultipleAnswer($answerList: [AnswerInput]) {
  createMultipleAnswer(answerList: $answerList) {
    demo_age
    email
  }
}
```
### Query Variables
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

## Get 
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
```
$ use radarTechDB
```
Find All 
```
$ db.answers.find()
```
Remove all (only for dev)
```
db.answers.remove( { } )
```

# Mettre à jour le modèle de données
Mettre à jour le fichier questionnaire.js avec le nouveau questionnaire.
Exécuter le script `./scripts/createSchema.js`.
Les fichiers `./src/graphqlSchema.js` et `./src/mongoSchema.js` seront mis à jour
  


