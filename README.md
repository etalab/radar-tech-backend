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
## Créer une application
1. Cloner le dépot en local
2. Ajouter un fichier Procfile (opt)

    __ce fichier est déjà disponible dans ce dépot__
    
    Le fichier contient la commande nécessaire pour lancer l'application : 

    ```
    web: node src/app.js
    ```

    Ajouter et enregistrer le fichier :
    ```
    $ git add Profile / git commit -m "add procfile"
    ```

3. Créer des variables d'environnement
    ```
    $ export DOKKU_HOST='studio-01.infra.data.gouv.fr'
    $ export DOKKU_PORT='22'
    ```

4. Vérifier que les variables sont à jour :
    ```
    $ env | grep DOKKU
    ```

5. Déployer l'application

    - Créer une nouvelle application
    A la racine du dossier du projet
    ```
    $ dokku apps:create <nom_app>`
    ```

    Un remote Dokku est ajouté pointant sur le dépôt distant
    - Mettre a jour une application existante
    Ajouter le dépôt dokku en local :
    ```
    $ git remote add dokku dokku@studio-01.infra.data.gouv.fr:<nom_app>
    ```
  
6. Ajoute la variable d'environnement API_URL
C'est l'adresse du backend qui est utilisée dans le mail de confirmation de participation.
    ```
    $ dokku config:set nom_app API_URL=http://<nom_app>.app.etalab.studio
    ```
    dokku config:set test-automatisation-rt API_URL=http://test-automatisation-rt.app.etalab.studio

7. Pousser les modification locale
    ```
    $ git push dokku master
    Ou 
    $ git push dokku <nom_branche>:master // pour pousser une autre branche
    ```

Notes : 
- /!\ Le client dokku en local infère le nom de l'application à partir du nom de remote.
- Pour pouvoir effectuer ces opérations sur le serveur Etalab il est nécessaire d'avoir partagé votre clé ssh à l'un des administrateurs.

## Variables d'environnement nécessaires : 

- API_URL:               *à ajouter MANUELLEMENT*
- DOKKU_APP_RESTORE:     1 __ajouté par Dokku__
- DOKKU_APP_TYPE:        herokuish __ajouté par Dokku__
- DOKKU_PROXY_PORT:      80 __ajouté par Dokku__
- DOKKU_PROXY_PORT_MAP:  http:80:5000 __ajouté par Dokku__
- GIT_REV:               99b3316454abea522684d6807294927579991faf __ajouté par Dokku__
- MONGO_URL:             __ajouté par Dokku__


## Créer une base de données avec Dokku
1. Si ce n'est pas déjà fait, créer des variables d'environnement 
```
$ export DOKKU_HOST='studio-01.infra.data.gouv.fr'
$ export DOKKU_PORT='22'
```
2. Créer le service avec Dokku
```
$ dokku mongo:create <db_name>
```
3. Lier la base avec l'application
```
$ dokku mongo:link <db_name> <app_namme>
```
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
Voici une liste des commandes utiles pour administrer la base :
```
$ use radarTechDB
$ db.answers.find() // Afficher tous les docuements de la collection answers
$ db.answers.remove( { } ) // Supprimer tous les docuements de la collection answers
```

# Authentification
1. Copier le fichier ./script/.env.example et le renommer en .env
1. Remplir la valeur MONGO_URL dans le fichier .env
2. Remplir la valeur de ACCESS_TOKEN_SECRET avec celle du serveur (dokku)
3. Lancer le script __createAccessToken__ avec le nom de l'utilisateur et son rôle 
Rôles acceptés : ["frontend", "dev"]
```
node createAccessToken.js <username> <usertoken>
```

# Mettre à jour le modèle de données
## Manuellement
1. ajouter un attribut dans le schéma mongo
Dans le fichier `mongoSchema.js`, ajouter un attribut dans le dictionnaire `mongoSchema`.
Les types sont disponibles dans [la documentation Mongo](https://mongoosejs.com/docs/schematypes.html).
Différentes clés peuvent être ajoutées, par exemple : 
    ```
    confirm_email: {
        type: String,
        required: true,
        default: false
      }
    ```
    Sachant que `containers_bool: String` est équivalent à `containers_bool: String`.

2. ajouter un attribut dans le schéma graphql
Dans le fichier `graphqlSchema`, ajouter un attribut dans le dictionnaire `answerTypeGql` en suivant le format : 
    ```
    NOM_ATTRIBUT: { type: <GRAPHQL_TYPE>}
    ```
    Les types disponibles sont détaillés dans [la documentation de la librairie graphql-js](https://graphql.org/graphql-js/type/)
    
    Le type doit être importé :
    ```
    const {
        GraphQLID,
      GraphQLNonNull,
      GraphQLString,
      GraphQLList,
      GraphQLInt,

    } = require("graphql");
    ```

## Avec un script 
__cette section et le script sont en cours, ne pas en tenir compte__
Mettre à jour le fichier questionnaire.js avec le nouveau questionnaire.

Exécuter le script `./scripts/createSchema.js`.

Les fichiers `./src/graphqlSchema.js` et `./src/mongoSchema.js` seront mis à jour.
