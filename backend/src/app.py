import secrets
from flask import Flask,request,jsonify, session, abort
import requests
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)
CLIENT_ID = "e7231ef0e449bce7d695"
CLIENT_SECRET = "d8c966df9903e6e9fe3a3372708daea192bdd041"

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
    if response.status_code == 200:
        contributors ={}
        for d in data:
            contributors[d['node_id']] = d['login']
        return jsonify(contributors)
    else:
        abort(404)
        
@app.route('/getCommits', methods=['GET'])
def getCommits():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    contributor = request.args.get("author").split(":")[0]
    startDate = request.args.get("since")
    endDate = request.args.get("until")
    owner, repo = repo_name.split('/')

    if(contributor == "0" or contributor == None):
         author = ""
    else:
         author = "author: {id: \"" + str(contributor) + "\"}, "

    variables = {
    "owner": owner,
    "name": repo,
    "after": None,
    "since": startDate,
    "until": endDate
    }

    query = """
                query ($owner: String!, $name: String!, $since: GitTimestamp!, $until: GitTimestamp!, $after: String) {
                    repository(owner: $owner, name: $name) {
                        refs(refPrefix: "refs/heads/", orderBy: {direction: DESC, field: TAG_COMMIT_DATE}, first: 100,after:$after){
                        pageInfo{
                            hasNextPage
                            endCursor
                            }
                            nodes{
                                name
                                target{
                                    ... on Commit {
                                        history("""+author+""" first: 100, since: $since, until: $until) {
                                            pageInfo{
                                                hasNextPage
                                                endCursor
                                            }
                                            nodes{
                                                author{
                                                    user{
                                                        login
                                                    }
                                                },
                                                oid
                                                committedDate
                                                additions
                                                deletions
                                                commitUrl
                                                message
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                """
    
    dataToSend = []
    parsedCommitList={}
    oidList = set()
    has_next_page = True
    while has_next_page:
        response = requests.post("https://api.github.com/graphql", json={"query": query, "variables": variables}, headers={
    "Authorization": token
    })
        data = response.json() 
        parseCommitData(data,parsedCommitList,oidList)
        has_next_page = data["data"]["repository"]["refs"]["pageInfo"]["hasNextPage"]
        if has_next_page:
            end_cursor = data["data"]["repository"]["refs"]["pageInfo"]["endCursor"]
            variables["after"] = end_cursor

    for cdate in parsedCommitList.keys():
        entry = {}
        entry['date'] = cdate
        entry['commit_count'] = len(parsedCommitList.get(cdate))
        entry['commit_details'] = parsedCommitList.get(cdate)
        dataToSend.append(entry)

    return jsonify(dataToSend)
    

def parseCommitData(response,parsedCommitList,oidList):
     nodes = response['data']['repository']['refs']['nodes']
     for branch in nodes:
          branchName = branch['name']
          commitsOnBranch = branch['target']['history']['nodes']
          for commit in commitsOnBranch:
               if(commit['oid'] in oidList):
                    continue
               oidList.add(commit['oid'])
               formatted_date = formatDate(commit['committedDate'])
               if formatted_date in parsedCommitList:
                    parsedCommitList[formatted_date].append(constructEachCommitEntry(commit,branchName))
               else:
                    parsedCommitList[formatted_date] = [constructEachCommitEntry(commit,branchName)]
     
def constructEachCommitEntry(commit,branchName):
        commmit_entry = {}
        commmit_entry['oid'] = commit['oid']
        commmit_entry['branch'] = branchName
        commmit_entry['additions'] = commit['additions']
        commmit_entry['deletions'] = commit['deletions']
        if commit['author']['user']:
             commmit_entry['author'] = commit['author']['user']['login']
        else:
             commmit_entry['author'] = 'None'
        commmit_entry['author'] = commit['author']['user']['login']
        commmit_entry['html_url'] = commit['commitUrl']
        commmit_entry['message'] = commit['message']
        return commmit_entry

def formatDate(value):
     date = datetime.strptime(value, '%Y-%m-%dT%H:%M:%SZ')
     return date.strftime('%Y-%m-%d')

@app.route('/getPRs', methods=['GET'])
def getPRs():
    token = request.headers.get('Authorization')
    repo_name = request.args.get("repo")
    contributor = request.args.get("author").split(":")[1]
    startDate = formatDate(request.args.get("since"))
    endDate = formatDate(request.args.get("until"))

    if contributor is None or contributor == '0':
         login = ""
    else:
         login = "author:"+contributor

    variables = {
    "query": "repo:"+repo_name+" is:pr "+login+" created:"+startDate+".."+endDate,
    "after":None
    }

    prQuery = """
        query ($query: String!, $after:String) 
            {
                search(first: 100 query: $query type: ISSUE after: $after){
                    nodes {
                        ... on PullRequest {
                                title
                                url
                                createdAt
                                author {
                                    login
                                }
                                state
                                headRef {
                                    name
                                }
                                baseRef {
                                    name
                                }
                                reviews(first: 100) {
                                    nodes {
                                        author {
                                            login
                                            }
                                        body
                                    }
                                }
                                comments(first: 100) {
                                    nodes {
                                        author {
                                            login
                                            }
                                        body
                                    }
                                }
                                reviewRequests(first: 20) {
                                    nodes {
                                        requestedReviewer {
                                            ... on User {
                                                    login
                                                    }
                                                }
                                            }
                                        }
                                }
                            }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        """
    dataToSend = []
    parsedPRList={}
    has_next_page = True
    while has_next_page:
        response = requests.post("https://api.github.com/graphql", json={"query": prQuery, "variables": variables}, headers={
    "Authorization": token
    })
        data = response.json() 
        parsePullRequestData(data,parsedPRList)
        has_next_page = data["data"]["search"]["pageInfo"]["hasNextPage"]
        if has_next_page:
            end_cursor = response.json()["data"]["search"]["pageInfo"]["endCursor"]
            variables["after"] = end_cursor

    for pDate in parsedPRList.keys():
        entry = {}
        entry['date'] = pDate
        entry['pr_count'] = len(parsedPRList.get(pDate))
        entry['pr_details'] = parsedPRList.get(pDate)
        dataToSend.append(entry)

    return jsonify(dataToSend)


def constructEachPullRequestEntry(pullrequest):
        pr_entry = {}
        pr_entry['title'] = pullrequest['title']
        pr_entry['url'] = pullrequest['url']
        pr_entry['author'] = pullrequest['author']['login']
        pr_entry['state'] = pullrequest['state']
        pr_entry['headRef'] = pullrequest['headRef']['name']
        pr_entry['baseRef'] = pullrequest['baseRef']['name']

        reviews = []
        for review in pullrequest['reviews']['nodes']:
            reviews.append({"author":review['author']['login'],"comment":review['body']})
        pr_entry['reviews']=reviews

        comments = []
        for comment in pullrequest['comments']['nodes']:
            comments.append({"author":comment['author']['login'],"comment":comment['body']})
        pr_entry['comments']=comments

        reviewers = []
        for reviewer in pullrequest['reviewRequests']['nodes']:
            reviewers.append(reviewer['requestedReviewer']['login'])
        pr_entry['reviewers']=reviewers

        return pr_entry
    
def parsePullRequestData(data,parsedPRList):
    for entry in data['data']['search']['nodes']:
        formatted_date = formatDate(entry['createdAt'])
        if formatted_date in parsedPRList:
            parsedPRList[formatted_date].append(constructEachPullRequestEntry(entry))
        else:
            parsedPRList[formatted_date] = [constructEachPullRequestEntry(entry)]

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=9000, debug=True)
