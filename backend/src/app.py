import json
import secrets
from flask import Flask,request,jsonify, session
import requests
from flask_cors import CORS
# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)
CLIENT_ID = "e7231ef0e449bce7d695"
CLIENT_SECRET = "d8c966df9903e6e9fe3a3372708daea192bdd041"
repositories=[]
excelRepos=[]

@app.route('/getAccessToken', methods=['GET'])
def getAccessToken():
    args = request.args
    code = args.get("code")
    url = "https://github.com/login/oauth/access_token"
    headers = {'Accept':'application/json'}
    data = {
        'client_id':CLIENT_ID,
        'client_secret':CLIENT_SECRET,
        'code':code
    }
    response = requests.post(url,headers=headers,data=data)
    # TODO:  validate response and send appropriate results
    return response.json()

@app.route('/getUserData', methods=['GET'])
def getUserData():
    token = request.headers.get('Authorization')
    url = "https://api.github.com/user"
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    session['username']=response.json()['login']
    return response.json()

@app.route('/getUserRepos', methods=['GET'])
def getUserRepos():
    token = request.headers.get('Authorization')
    print(token)
    url = "https://api.github.com/user/repos"
    headers = {'Authorization' : token}
    response = requests.get(url, headers=headers)
    repoData = {}
    for repository in response.json():
        repoData[str(repository.get('id'))] = repository.get('full_name')   
    return jsonify(repoData)

@app.route('/getRepoContributors', methods=['GET'])
def getRepoContributors():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    url = "https://api.github.com/repos/"+repo_name+"/collaborators"
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    data=response.json()
    logins = [d['login'] for d in data]
    return jsonify(logins)

@app.route('/getCommits', methods=['GET'])
def getCommits():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    url = "https://api.github.com/repos/" + repo_name + "/commits"
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    data=response.json()
    return jsonify(data)

# /repos/:owner/:repo/pulls?state=all&creator=:username

@app.route('/getPRs', methods=['GET'])
def getPRs():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    contributor = request.args.get("creator")
    if (contributor == "all"):
        url = "https://api.github.com/repos/" + repo_name + "/pulls"
    elif (contributor == None):
        url = "https://api.github.com/repos/" + repo_name + "/pulls"
    elif(contributor != "all"):
        url = "https://api.github.com/repos/" + repo_name +"/pulls?state=all&creator=" + contributor 
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    data=response.json()
    return jsonify(data)

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=9000, debug=True)
