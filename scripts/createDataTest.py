import random
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

# DATAS
name = [
  "email",
  "demo_genre", 
  "demo_age", 
  "education_formation"
]

demo_genre_list = [
    "Homme",
    "Femme",
    "Non-binaire"
]

demo_age_list = ["15-19",
    "20-24",
    "25-29",
    "30-34",
    "35-39",
    "40-44",
    "45-49",
    "50-54",
    "55-59",
    "60-64",
    "65+"]

education_formation_list = [
    "Développeur informatique",
    "Développeur web",
    "Ingénieur informatique",
    "Développeur front-end",
    "Développeur back-end",
    "Développeur mobile",
    "Designer",
    "Datascientist",
    "Technicien de maintenance",
    "Chef·fe de projet",
    "Chef de produit",
    "Manager",
    "Cadre",
    "DevOps",
    "SRE",
    "Administrateur",
    "Expert en sécurité informatique",
    "Consultant",
    "Scrum-master",
    "Commerciale",
    "Directeur"
]

# Create 200 occurences
occList = []
for i in range(0,200):
  occ = {
    "email": "test{}@test.com".format(i),
    "demo_genre": random.choice(demo_genre_list),
    "demo_age": random.choice(demo_age_list),
    "education_formation": random.choice(education_formation_list)
  }
  occList.append(occ)
print(occList)

# push data in database with graphql
# Select your transport with a defined url endpoint
transport = AIOHTTPTransport(url="http://localhost:3001/graphql")
# transport = AIOHTTPTransport(url="http://fast-snow-hulu.app.etalab.studio/graphql")

# Create a GraphQL client using the defined transport
client = Client(transport=transport, fetch_schema_from_transport=True)

# Provide a GraphQL query

mutation = gql('''
  mutation CreateMultipleAnswer($answerList: [AnswerInput]) {
    createMultipleAnswer(answerList: $answerList) {
      email
    }
  }
'''
)

# Execute the query on the transport
result = client.execute(mutation, variable_values={ "answerList": occList })
print(result)


