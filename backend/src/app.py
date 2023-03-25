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

@app.route('/getRepoContributors', methods=['GET'])
def getRepoContributors():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    url = "https://api.github.com/repos/"+repo_name+"/collaborators"
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    data=response.json()
    print(response.status_code)
    if response.status_code == 200:
        logins = [d['login'] for d in data]
        return jsonify(logins)
    else:
        print(data)
        abort(404)
        
@app.route('/getCommits', methods=['GET'])
def getCommits():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    contributor = request.args.get("author")
    startDate = request.args.get("since")
    endDate = request.args.get("until")
    if (contributor == "all" or contributor == None):
        url = "https://api.github.com/repos/" + repo_name + "/commits?since="+startDate+"&until="+endDate
    elif(contributor != "all"):
        url = "https://api.github.com/repos/" + repo_name + "/commits?author=" + contributor+"&since="+startDate+"&until="+endDate
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    return jsonify(parseCommitData(repo_name, response.json(), contributor, startDate, endDate))
    
def parseCommitData(repo_name, data, contributor, startDate, endDate):
    token = request.headers.get('Authorization')
    headers = {'Authorization' : token}
    dataToSend = []
    parsedCommitList={}
    sdate = datetime.strptime(startDate, '%Y-%m-%dT%H:%M:%SZ')
    sdate = sdate.strftime('%Y-%m-%d')
    edate = datetime.strptime(endDate, '%Y-%m-%dT%H:%M:%SZ')
    edate = edate.strftime('%Y-%m-%d')
    for commit in data:
        date = datetime.strptime(commit['commit']['author']['date'], '%Y-%m-%dT%H:%M:%SZ')
        sha_id = commit['sha']
        url = "https://api.github.com/repos/" + repo_name + "/commits/" + str(sha_id)
        response = requests.get(url,headers=headers).json()
        # print("response is here", response)
        stats = response["stats"]
        commit["stats"] = stats
        formatted_date = date.strftime('%Y-%m-%d') 
        if not (formatted_date >= sdate and formatted_date <= edate):
                continue     
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
        commmit_entry['stats'] = commit['stats']
        commmit_entry['comment'] = {'comment_count':commit['commit']['comment_count'],'comments_url':commit['comments_url']}
        return commmit_entry
# /repos/:owner/:repo/pulls?state=all&creator=:username

@app.route('/getPRs', methods=['GET'])
def getPRs():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    contributor = request.args.get("author")
    startDate = request.args.get("since")
    endDate = request.args.get("until")
    url = "https://api.github.com/repos/" + repo_name +"/pulls?state=all"
    headers = {'Authorization' : token}
    response = requests.get(url,headers=headers)
    return jsonify(parsePullRequestData(response.json(),contributor,startDate,endDate))

def constructEachPullRequestEntry(pullrequest):
        pr_entry = {}
        pr_entry['number'] = pullrequest['number']
        pr_entry['date'] = pullrequest['created_at']
        pr_entry['author'] = pullrequest['user']['login']
        pr_entry['html_url'] = pullrequest['html_url']
        pr_entry['title'] = pullrequest['title']
        pr_entry['head_branch'] = pullrequest['head']['ref']
        pr_entry['base_branch'] = pullrequest['base']['ref']
        # pr_entry['reviewers'] = pullrequest['requested_reviewers']
        reviewers = ", ".join([reviewer['login'] for reviewer in pullrequest['requested_reviewers']])
        print(reviewers)
        pr_entry['reviewers'] = reviewers
        # if len(pullrequest['requested_reviewers']) > 0: 
        #     for reviewer in pullrequest['requested_reviewers']:
        #         login = reviewer['login']
        pr_entry['review_comments'] = pullrequest['review_comments_url']
        return pr_entry
    
def parsePullRequestData(data,contributor,startDate,endDate):
   
    sdate = datetime.strptime(startDate, '%Y-%m-%dT%H:%M:%SZ')
    sdate = sdate.strftime('%Y-%m-%d')
    edate = datetime.strptime(endDate, '%Y-%m-%dT%H:%M:%SZ')
    edate = edate.strftime('%Y-%m-%d')
    dataToSend = []
    parsedPRList={}
    for pullrequest in data:
        user = pullrequest['user']['login']
        if(user == contributor or contributor=='all' or contributor is None):
            date = datetime.strptime(pullrequest['created_at'], '%Y-%m-%dT%H:%M:%SZ')
            formatted_date = date.strftime('%Y-%m-%d')
            logins = ", ".join([reviewer['login'] for reviewer in pullrequest['requested_reviewers']])
            print(logins)
            if not (formatted_date >= sdate and formatted_date <= edate):
                continue
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
