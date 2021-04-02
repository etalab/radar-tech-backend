# BACKEND 
##  Création du modèle
copier les fichiers sources des questionanires dans le dossiers ./scripts/sources
exécuter le script pour générer les modèles
```
node createSchema <path_vers_le_fichier>
```
Le modèles est mis à jour dans le dossier ./src/db/Answers.js
### Pistes d'amélioration 
J'ai plusieurs fichiers en entrée avec un clé
Cette clé représente le nom du modèle
Je peux générer des modèles en fonctions des fichiers
soit j'exécute le script sur un dossier
soit on exécute plusieurs fois le scripts avec des noms de fichiers en entrée
soit on a un fichier yaml et on récupère la liste des fichiers

## Créer une base de données

## Créer une app 

### linker l'app et la DB

### Ajouter les variables d'environnement requises

## Création d'un utilisateur pour les tests et pour le frontend
le endpoint est protégé par un token
on a pas d'interface d'admin donc la création de l'utilisateur est semi automatisée
1. Créer le salt et hash d'un mot de passe
```
cd script
node createUser.js <username> <password>
````
le salt et le mot de passe sont affichées en console
2. Créer l'utilisateur manuellement en base de données
En effet, seul l'app dokku peut accéder à la DB
sans interface d'admin on doit aller créer l'utilisateur manuellement
dokku mongo:connect
> use <nom de la db>
> insert({...})

3. Générer un token semi manuellement 
Une route est dédié à la génération du token
```
curl --location --request POST 'http://test-automatisation-rt.app.etalab.studio/token' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "audrey1851",
    "password": "TrgYrSZ4hHJr6"
}'
```

```
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://test-automatisation-rt.app.etalab.studio/token',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"username":"audrey1851","password":"TrgYrSZ4hHJr6"})

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```


