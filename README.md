# Projet RadarTech
## Objectif 
...
## Pré-requis
- graphql
- nodejs
- mongodb

# Développement

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

### Dans mon projet express/nodejs: 
Ajouter un procfile
```
$ git add / git commit
$ git push dokku master #sur master met à jour l'application
```

## Base de données
Le plugin mongodb existe déjà
Sur la doc du plugin en question ou dokku mongo
```
$ dokku mongo:create <nom> 
```
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



