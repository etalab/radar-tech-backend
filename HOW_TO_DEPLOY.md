# Radar-Tech ([version originale disponible ici](https://github.com/etalab/radar-tech-backend/blob/master/HOW_TO_DEPLOY.md))
## Déployer le Back-End
### Créer le modèle

```
git clone https://github.com/etalab/radar-tech-backend.git
cd radar-tech-backend
mkdir src/db/metiers
cd scripts
node createSchema <chemin_metier_json>
cd ..
```

**Patché dans cette pull request**

~~**Attention** : Il est nécessaire de d'abord créer le dossier `metiers` avant le lancer le script `createSchema` pour que celui-ci fonctionne~~

### Créer l'application Dokku

```
dokku apps:create <nom_application>
```

#### Ajouter les variables d'environnement

```
dokku config:set <nom_application> API_URL=http://<nom_application>.app.etalab.studio
dokku config:set <nom_application> ACCESS_TOKEN_TYPE='Bearer'
dokku config:set <nom_application> ACCESS_TOKEN_ALGORITHM='HS256'
dokku config:set <nom_application> ACCESS_TOKEN_SECRET='<token_secret>'
dokku config:set <nom_application> SIB_API_KEY=<sendinblue_api_key>
```

`<token_secret>` correspond à la clé secrète utilisée pour générer les token

#### Créer la base de données

```
dokku mongo:create <mongo_service_name>
dokku mongo:link <mongo_service_name> <nom_application>
```

Le résultat retourné correspond à l'adresse de connexion à la DB, au format :

`mongodb://<service_name>:2652096c746158e0fd896ff2b7416877@<service_user>:27017/<nom_db>`

La commande `mongo:link` va automatiquement ajouter l'URL vers Mongo en variable d'environnement.

A ce stade, il doit y avoir au moins ces 6 variables d'environnement.

Pour vérifier, il est possible de les lister :

```
dokku config:show <nom_application>

ACCESS_TOKEN_ALGORITHM:  HS256
ACCESS_TOKEN_SECRET:     <token_secret>
ACCESS_TOKEN_TYPE:       Bearer
API_URL:                 http://<nom_application>.app.etalab.studio
MONGO_URL:               mongodb://<mongo_service_name>:<number_generated_by_dokku_service>@dokku-mongo-<mongo_service_name>:27017/<nom_db>
SIB_API_KEY:             <sendinblue_api_key>
```

### Tester

```
cd ..
npm install
npm run dev
```

### Créer un token

En amont, il faut créer un utilisateur manuellement (à améliorer).

Il n'y a pas d'interface d'administration, donc la création de l'utilisateur est semi-automatisée.

#### Créer le salt et hash d'un mot de passe

```
cd script
node createHashAndSalt.js <nom_utilisateur> <mot_de_passe>
```

Le salt et le mot de passe hashé sont affichés dans la console

#### Créer un utilisateur dans la base de données

```
dokku mongo:connect <nom_db>
> db.users.insert({ username: 'frontend-app', role: 'frontend', password: '51407e040228a336a4db37684ce7ee9aee73c457a988b0493cb62930f0dfcf59', salt: '1c66ebc09fcf320a9189215c94bd93d8' })
```
Le nom de la DB est indiqué à la fin de l'url de connexion :

`mongodb://<service_name>:2652096c746158e0fd896ff2b7416877@<service_user>:27017/<nom_db>`

#### Générer un token semi-manuellement

Une route est dédiée à la génération du token

##### Exemple avec CURL

```
curl --location --request POST 'http://<nom_application>.app.etalab.studio/token' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "<nom_utilisateur>",
    "password": "<mot_de_passe>"
}'
```

##### Exemple avec Node.js Request

```
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://<nom_application>.app.etalab.studio/token',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"username":"frontend","password":"<mot_de_passe>"})

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```

### Lancer l'application

Un nouveau schéma a été généré, la branche doit être créée avec ces modifications.

```
git remote add dokku dokku@<ip_serveur>:<nom_application>
git checkout -B deploy
git add src/
git commit -m "generate schema"
git push dokku deploy:master
```

**Remarque** : Sur ma machine, il est nécessaire de d'abord Husky installer en local grâce à la commande :

`npm install husky`

## Déployer le Front-End

### Récupérer le projet

```
git clone https://github.com/etalab/radar-tech-frontend.git
cd radar-tech-frontend
git checkout test/deployApp
```

### Ajouter le fichier décrivant les questionnaires

```
cd ..
mv <metier>.json radar-tech-frontend/pages-metiers/<metier>.json
```

### Tester

Ajouter les variables d'environnement dans un fichier `.env.development` à la racine du projet contenant :

```
GATSBY_API_URL=<url_backend>
GATSBY_API_TOKEN=<token_backend>
```

Puis installer les dépendances et lancer l'application en locale

```
sudo npm install -g gatsby-cli
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
npm install
gatsby develop
```

### Créer l'application Dokku

#### Créer une nouvelle application Dokku

```
dokku apps:create <nom_application>
```

#### Ajouter les variables d'environnement

Le token pour accéder à l'API a été généré en amont. (cf. [Créer un token](#Creer-un-token))

Créer un fichier .env.production et ajouter les variables suivantes :

```
dokku config:set GATSBY_API_URL=<url_backend>
dokku config:set GATSBY_API_TOKEN=<token_backend>
```

#### Lancer l'application

**Attention** : Comme on utilise 2 buildpacks, il faut utiliser le .buildpacks à la racine du projet, pour cela on s'assure qu'il n'y ait pas de buildpack set sur Dokku à l'aide de la commande :

`dokku buildpacks:clear <nom_application>`

ou directement se passer du .buildpacks en faisant :

```
dokku buildpacks:add --index 1 radar-tech-front https://github.com/heroku/heroku-buildpack-nodejs.git#v175
dokku buildpacks:add --index 2 radar-tech-front https://github.com/heroku/heroku-buildpack-static.git
```

- Créer une nouvelle branche de déploiement
- Ajouter les nouveaux questionnaires au format JSON
- Forcer l'ajout du fichier de configuration
- Pousser la nouvelle branche sur le dépôt distant Dokku

**Attention** : Il ne faut pas pousser cette branche sur le dépôt d'origine, elle contient le fichier d'environnement

```
git remote add dokku dokku@<ip_serveur>:<nom_application>
git checkout -b deploy
git add pages-metiers/
git add src/pages/resultats.tsx
git commit -m "add metiers"
git push dokku deploy:master
```

**Attention** : Il faut modifier la page `resultats.tsx` pour pouvoir déployer l'application, il faut retirer cette section là : 

```
      <section>
        <h3 style={{ marginBottom: `0.7rem` }}>Démographie</h3>
        <WeePeopleBar data={gender_flat} />
        <p>
          Note:{' '}
          {results.length - gender_flat.map(e => e.n).reduce((a, b) => a + b)}
          réponse(s) exclue(s) car invalide (null)
        </p>
      </section>
```
## Des pistes d'amélioration

- Automatiser toutes ces étapes
- Ajouter une interface d'administration

Il y a plusieurs fichiers en entrée avec une clef. Cette clef représente le nom du modèle.

On peut générer des modèles en fonction des fichiers : 
   - soit on exécute le script sur un dossier
   - soit on exécute plusieurs fois le script avec des noms de fichiers en entrée
   - soit on a un fichier yaml et on récupère la liste des fichiers

