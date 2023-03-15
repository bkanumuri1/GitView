import json
import secrets
from flask import Flask,request,jsonify, session
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

# @app.route('/getTableInfo', methods = ['GET'])
# def getTableInfo():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    contributor = request.args.get("author")

    commitData = getCommits(token,repo_name,contributor)
    commitDetailsMap = parseCommitData(commitData)

    prData = getPRs(token,repo_name)
    prDetailsMap=parsePullRequestData(prData,contributor)

    commitDates = list(commitDetailsMap.keys())
    prDates = list(prDetailsMap.keys())

    data = []
    for cdate in commitDates:
        entry = {}
        entry['date'] = cdate
        entry['commit_count'] = len(commitDetailsMap.get(cdate))
        entry['commit_details'] = commitDetailsMap.get(cdate)
        
        if cdate in prDates:
            entry['pr_count'] = len(prDetailsMap.get(cdate))
            entry['pr_details'] = prDetailsMap.get(cdate)
            prDates.remove(cdate)
        else:
            entry['pr_count'] = 0
            entry['pr_details'] = []

        data.append(entry)

    # if more PRs are left: 
    for prDate in prDates:
        entry = {}
        entry['date'] = cdate
        entry['commit_count'] = 0
        entry['commit_details'] = []
        entry['pr_count'] = len(prDetailsMap.get(prDate))
        entry['pr_details'] = prDetailsMap.get(prDate)
        data.append(entry)
       
    return jsonify(data)


@app.route('/getCommits', methods=['GET'])
def getCommits():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    contributor = request.args.get("author")
    if (contributor == "all" or contributor == None):
        url = "https://api.github.com/repos/" + repo_name + "/commits"
    elif(contributor != "all"):
        url = "https://api.github.com/repos/" + repo_name + "/commits?author=" + contributor
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    return jsonify(parseCommitData(response.json()))
    
def parseCommitData(data):
    dataToSend = []
    parsedCommitList={}
    for commit in data:
        date = datetime.strptime(commit['commit']['author']['date'], '%Y-%m-%dT%H:%M:%SZ')
        formatted_date = date.strftime('%Y-%m-%d')      
        # parsedCommitCount[formatted_date] =parsedCommitCount.get(formatted_date,0)+1
        if formatted_date in parsedCommitList:
            parsedCommitList[formatted_date].append(constructEachCommitEntry(commit))
        else:
            parsedCommitList[formatted_date] = [constructEachCommitEntry(commit)]

    for cdate in parsedCommitList.keys():
        entry = {}
        entry['date'] = cdate
        entry['commit_count'] = len(parsedCommitList.get(cdate))
        entry['commit_details'] = parsedCommitList.get(cdate)
        dataToSend.append(entry)
    return dataToSend

def constructEachCommitEntry(commit):
        commmit_entry = {}
        commmit_entry['sha'] = commit['sha']
        commmit_entry['date'] = commit['commit']['author']['date']
        commmit_entry['author'] = {'name':commit['commit']['author']['name'],'login':commit['author']['login']}
        commmit_entry['html_url'] = commit['html_url']
        commmit_entry['message'] = commit['commit']['message']
        commmit_entry['comment'] = {'comment_count':commit['commit']['comment_count'],'comments_url':commit['comments_url']}
        return commmit_entry
# /repos/:owner/:repo/pulls?state=all&creator=:username

@app.route('/getPRs', methods=['GET'])
def getPRs():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    contributor = request.args.get("author")
    url = "https://api.github.com/repos/" + repo_name +"/pulls?state=all"
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    return jsonify(parsePullRequestData(response.json(),contributor))

def constructEachPullRequestEntry(pullrequest):
        pr_entry = {}
        pr_entry['number'] = pullrequest['number']
        pr_entry['date'] = pullrequest['created_at']
        pr_entry['author'] = pullrequest['user']['login']
        pr_entry['html_url'] = pullrequest['html_url']
        pr_entry['title'] = pullrequest['title']
        pr_entry['head_branch'] = pullrequest['head']['ref']
        pr_entry['base_branch'] = pullrequest['base']['ref']
        print(pr_entry)
        return pr_entry
    
def parsePullRequestData(data,contributor):
    dataToSend = []
    parsedPRList={}
    for pullrequest in data:
        user = pullrequest['user']['login']
        if(user == contributor or contributor=='all' or contributor is None):
            date = datetime.strptime(pullrequest['created_at'], '%Y-%m-%dT%H:%M:%SZ')
            formatted_date = date.strftime('%Y-%m-%d')
            # parsedPRCount[formatted_date] =parsedPRCount.get(formatted_date,0)+1
            if formatted_date in parsedPRList:
                parsedPRList[formatted_date].append(constructEachPullRequestEntry(pullrequest))
            else:
                parsedPRList[formatted_date] = [constructEachPullRequestEntry(pullrequest)]

    for pDate in parsedPRList.keys():
        entry = {}
        entry['date'] = pDate
        entry['pr_count'] = len(parsedPRList.get(pDate))
        entry['pr_details'] = parsedPRList.get(pDate)
        dataToSend.append(entry)
    return dataToSend


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=9000, debug=True)
