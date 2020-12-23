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

answer = {
  "email": "audrey.bramy@gmail.com",
  "demo_genre": "femme",
  "demo_age": "25-29",
  "education_formation": "Ingénieur informatique"
}

# push data in database with graphql
# Select your transport with a defined url endpoint
transport = AIOHTTPTransport(url="http://fast-snow-hulu.app.etalab.studio/graphql")

# Create a GraphQL client using the defined transport
client = Client(transport=transport, fetch_schema_from_transport=True)

# Provide a GraphQL query

mutation = gql('''
  mutation CreateAnswer($answer: AnswerInput) {
    createAnswer(answer: $answer) {
      email
    }
  }
'''
)

# Execute the query on the transport
result = client.execute(mutation, variable_values={ "answer": answer })


