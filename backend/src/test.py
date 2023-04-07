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
                
#     PRquery = """
#     query($owner: String!, $repo: String!) {
#   repository(owner: $owner, name: $repo) {
#     pullRequests(states: [OPEN, CLOSED, MERGED], first: 100, orderBy: {field: CREATED_AT, direction: DESC}, baseRefName: null, headRefName: null) {
#       nodes {
#         number
#         state
#         title
#         url
#         baseRef {
#           name
#         }
#         headRef {
#           name
#         }
#         author {
#           login
#         }
#         merged
#         state
        # createdAt
        # comments (first: 10){
        #   edges{
        #     node{
        #       author{
        #         login
        #       }
        #       body
        #     }
        #   }
        # }
        # reviews(first: 10) {
        #   nodes {
        #     author {
        #       login
        #     }
        #     comments(first: 10) {
        #       nodes {
        #         body
        #       }
        #     }
        #   }
        # }
#         mergeable
#       }
#       pageInfo {
#         endCursor
#         hasNextPage
#       }
#     }
#   }
# }
# """

  #   query = """
  #   query($owner: String!, $name: String!) {
  #   repository(owner: $owner, name: $name) {
  #           pullRequests (first: 100, states: [OPEN, CLOSED, MERGED], orderBy: {field: CREATED_AT, direction: DESC} ){
  #             edges{
  #               node{
  #                 author{
  #                   login
  #                 }
  #                 baseRefName
  #                 headRefName
  #                 body
  #                 state
  #                 createdAt
  #                 comments (first: 50){
  #                   edges{
  #                     node{
  #                       author{
  #                         login
  #                       }
  #                       body
  #                     }
  #                   }
  #                 }
  #                 reviews(first: 20) {
  #                   nodes {
  #                     author {
  #                       login
  #                     }
  #                     comments(first: 50) {
  #                       nodes {
  #                         body
  #                       }
  #                     }
  #                   }
  #                 }
  #               }
  #             }
  #           }
  #   }
  # }
  #   """

    query = """
    {
  search(query: "repo:bkanumuri/SER-517-Group-17---Github-Grading-Tool is:pr author:hlakshm2 -user:hlakshm2", type:PR, first: 100) {
    issueCount
    edges {
      node {
        ... on PullRequest {
          number
          title
          repository {
            nameWithOwner
          }
          createdAt
          mergedAt
          url
          changedFiles
          additions
          deletions
        }
      }
    }
  }
}
    """

    variables = {
    "owner": "bkanumuri1",
    "name": "SER-517-Group-17---Github-Grading-Tool",
    # "login": "hlakshm2",
    # "after": None
  }


    # .format(owner_name='bkanumuri1', repo_name='SER-517-Group-17---Github-Grading-Tool', user_login='hlakshm2')
    
    # Set the headers and access token
    headers = {'Authorization': 'Bearer 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'}
    url = 'https://api.github.com/graphql'
    data = {
        "query": query,
        "variables": {}
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
    
    
    
    query MyQuery {
  repository(name: "SER-517-Group-17---Github-Grading-Tool", owner: "bkanumuri1") {
    id
    pullRequests(
      states: [OPEN, CLOSED, MERGED]
      first: 100
      baseRefName: "main"
      orderBy: {field: CREATED_AT, direction: DESC}
    ) {
      edges {
        node {
          body
          createdAt
          author {
            login
          }
          comments(first: 50) {
            nodes {
              author {
                login
              }
              body
            }
          }
          reviews(first: 50) {
            edges {
              node {
                author {
                  login
                }
                comments(first: 50) {
                  edges {
                    node {
                      body
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
