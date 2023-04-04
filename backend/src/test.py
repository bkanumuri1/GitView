import json
import secrets
from flask import Flask,request,jsonify, session, abort
import requests
from flask_cors import CORS
from datetime import datetime
# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)
CLIENT_ID = "e7231ef0e449bce7d695"
CLIENT_SECRET = "d8c966df9903e6e9fe3a3372708daea192bdd041"


@app.route('/pull-requests')
def get_pull_requests():
    # Set the GraphQL query
    query = """
    query ($owner: String!, $name: String!, $login: ID!, $after: String) {
  repository(owner: $owner, name: $name) {
    refs(refPrefix: "refs/heads/", first: 100) {
      nodes {
        name
        target {
          ... on Commit {
            history(first: 100, after: $after, author: { id: $login }) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                oid
                message
                author {
                  name
                  email
                  date
                }
              }
            }
          }
        }
      }
    }
  }
}"""
    variables = {
    "owner": "bkanumuri1",
    "name": "SER-517-Group-17---Github-Grading-Tool",
    "login": "MDQ6VXNlcjkwMDczMzkw",
    "after": None
}
# query1 = """
#         query {
#   repository(owner: "bkanumuri1", name: "SER-517-Group-17---Github-Grading-Tool") {
#     refs(refPrefix: "refs/heads/", orderBy: {direction: DESC, field: TAG_COMMIT_DATE}, first: 100) {
#       edges {
#         node {
          
#           ... on Ref {
            
#             name
#             target {
#               ... on Commit {
                
#                 history(author: { id: "MDQ6VXNlcjkwMDczMzkw" }, first: 5, since: "2023-03-03T00:00:00Z", until: "2023-04-04T00:00:00Z") {
#                   pageInfo{
#                     hasNextPage
#                     endCursor
#                   }
#                   edges {
#                     node {
#                       ... on Commit {
#                         author{
#                           user{
#                             login
#                           }
#                         },
#                         committedDate
#                         additions
#                         deletions
#                         commitUrl
#                         message
#                       }
#                     }
#                   }
#                 }
#               }
#             }
#           }
#         }
#       }
#     }
#   }
# }
#             """
    # .format(owner_name='bkanumuri1', repo_name='SER-517-Group-17---Github-Grading-Tool', user_login='hlakshm2')
    
    # Set the headers and access token
    headers = {'Authorization': 'Bearer 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'}
    url = 'https://api.github.com/graphql'
    data = {
        "query": query,
        "variables": variables
    }
    json_data = json.dumps(data)

    # Send the GraphQL request
    response = requests.post(url, headers=headers, data=json_data)
    # Send the GraphQL query to the API
    # response = requests.post(url, json={'query': query}, headers=headers)
    # print(response.headers)
    # Return the results
    return response.json()

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=9001, debug=True)
