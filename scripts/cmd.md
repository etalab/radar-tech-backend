# Frontend
git clone https://github.com/etalab/radar-tech-frontend.git
cd radar-tech-frontend
git checkout test/staticQuestionnaire
cd ..
mv pages-metiers.json radar-tech-frontend/pages-metiers/

# Backend

## création du modèle
git clone https://github.com/etalab/radar-tech-backend.git
cd radar-tech-backend
git checkout radarTechCreator
cd scripts
node deployOnDokku.js /Users/audrey/Documents/development/test-automatisation/designer.json
cd ..

## Creation app dokku et config
```
export DOKKU_HOST='studio-01.infra.data.gouv.fr'
export DOKKU_PORT='22'
dokku apps:create <app_name>
dokku config:set API_URL=http://<app_name>.app.etalab.studio
dokku config:set ACCESS_TOKEN_TYPE='Bearer'
dokku config:set ACCESS_TOKEN_ALGORITHM='HS256'
dokku config:set ACCESS_TOKEN_SECRET='<token_secret>'
```
`<token_secret>` correspond à la clé secrète utilisé pour généré 

## Création de la DB
dokku mongo:create <service_name>
dokku mongo:link <service_name> <app_name>
Dans le résultat retourné `Dsn` coorrespond à l'adresse de connexion à la DB, au format : `mongodb://<service_name>:2652096c746158e0fd896ff2b7416877@<service_user>:27017/<db_name>`
Le nom de la base est à noté
La commande Link a automatiquement ajouté l'URL vers Mongo en variable d'environnement.
A ce stage il doit y avoir 4 variable d'environnement
Pour vérifier il est possible de les lister
```
$ dokku config
> 
ACCESS_TOKEN_ALGORITHM:  HS256
ACCESS_TOKEN_SECRET:     <token_secret>
ACCESS_TOKEN_TYPE:       Bearer
API_URL:                 http://.app.etalab.studio
MONGO_URL:
```

## Tester
cd ..
npm install
npm run dev

## Lancer l'app sur dokku
// ICI un nouveau schema est généré, sur dokku on déploie une branche
//il faut donc faire un commit et un push sur une branche temporaire
git checkout -B deploy
git add src/
git commit -m "generate schema"
git push dokku deploy:master

## Créer un token pour le front

En amont il faut créer un user manuellement
on a pas d'interface d'admin donc la création de l'utilisateur est semi automatisée

### Créer le salt et hash d'un mot de passe
```
cd script
node createHashAndSalt.js <username> <password>
```
le salt et le mot de passe hashé sont affichées en console

### Créer un utilisateur en base de données 
```
dokku mongo:connect
> use <nom de la db>
> db.users.insert({ username: 'frontend-app', role: 'frontend', password: 'c06ff7007201e247ae1faa5ab6be2837feeea5ad883b8efd7e89090897d69ffd', salt: 'a43ae6043b711abd74972f46acf4c39e' })
```
Le nom de la DB est indiqué à la fin de l'url de connexion `mongodb://<service_name>:2652096c746158e0fd896ff2b7416877@<service_user>:27017/<db_name>`

### Générer un token semi manuellement 
Une route est dédié à la génération du token
CURL
```
curl --location --request POST 'http://<nom_app>.app.etalab.studio/token' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "frontend",
    "password": "<password>"
}'
```

Nodejs Request
```
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://<nom_app>.app.etalab.studio/token',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"username":"frontend","password":"<password>"})

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```

## Pistes d'amélioration 
J'ai plusieurs fichiers en entrée avec un clé
Cette clé représente le nom du modèle
Je peux générer des modèles en fonctions des fichiers
soit j'exécute le script sur un dossier
soit on exécute plusieurs fois le scripts avec des noms de fichiers en entrée
soit on a un fichier yaml et on récupère la liste des fichiers



