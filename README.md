# RadarTech : Backend

Ce projet est le **Backend** de l'application [RadarTech](https://github.com/etalab/radar-tech). La procédure de déploiement est disponible sur le dépôt principal de l'application.

## Outils utilisés

- GraphQL
- NodeJS
- mongoDB

## Pré-requis

- Node 14
- npm 6

## Documentation

### GraphQL
 
Les requêtes suivantes sont celles autorisées actuellement :

#### Ajouter une réponse

##### Mutation

```
mutation <metier>($answer: <metier>Input!) {
  <metier>(answer: $answer) {
    email
  }
}
```

##### Variable

```
{
  "answer": {
  "email": "<a unique valid email>",
  "demo_age": "<age>"
}
}
```

#### Accèder aux réponses

```
{
  <metier> {
    email,
    demo_age,
    demo_genre,
    education_formation
  }
}
```

### mongoDB

Voici une liste des commandes utiles pour administrer la base :

```
$ use radarTechDB
$ db.answers.find() // Afficher tous les documents de la collection answers
$ db.answers.remove( { } ) // Supprimer tous les docuements de la collection answers
```

#### Authentification

1. Copier le fichier `./script/.env.example` et le renommer en `.env`
2. Remplir la valeur `MONGO_URL` dans le fichier `.env`
3. Remplir la valeur de `ACCESS_TOKEN_SECRET` avec celle du serveur
4. Lancer le script `__createAccessToken__` avec le nom de l'utilisateur et son rôle 
Rôles acceptés : ["frontend", "dev"]

```
node createAccessToken.js <username> <usertoken>
```

#### Mettre à jour le modèle de données (manuellement)

1. Ajouter un attribut dans le schéma mongo

Dans le fichier `mongoSchema.js`, ajouter un attribut dans le dictionnaire `mongoSchema`.
Les types sont disponibles dans [la documentation mongoose](https://mongoosejs.com/docs/schematypes.html).
Différentes clés peuvent être ajoutées, par exemple :

```
    confirm_email: {
        type: String,
        required: true,
        default: false
      }
```

Sachant que `containers_bool: String` est équivalent à `containers_bool: String`.

2. Ajouter un attribut dans le schéma GraphQL
Dans le fichier `graphqlSchema`, ajouter un attribut dans le dictionnaire `answerTypeGql` en suivant le format :

```
    NOM_ATTRIBUT: { type: <GRAPHQL_TYPE>}
```

Les types disponibles sont détaillés dans [la documentation de la librairie GraphQL-JS](https://graphql.org/graphql-js/type/). Le type doit être importé :

```
    const {
        GraphQLID,
      GraphQLNonNull,
      GraphQLString,
      GraphQLList,
      GraphQLInt,

    } = require("graphql");
```

## Évolution à prévoir

- Si une réponse est soumise avec un email déjà présent en DB, un email est envoyé
- Être en mesure de modifier sa contribution
- Pouvoir supprimer sa soumission
