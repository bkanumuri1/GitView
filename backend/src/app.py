import requests

def get_contributor_stats(repo_link, access_token):
    headers = {
        "Authorization": "Token " + access_token
    }
    contributors_url = repo_link + "/collaborators"
    contributors = requests.get(contributors_url, headers=headers).json()
    for contributor in contributors:
        username = contributor["login"]
        commits_url = repo_link + "/commits?author=" + username
        commits = requests.get(commits_url, headers=headers).json()
        num_commits = len(commits)
        print(f"Username: {username}, Number of commits: {num_commits}")
        

        pull_requests_url = repo_link + "/pulls?author=" + username
        pull_requests = requests.get(pull_requests_url, headers=headers).json()
        num_pull_requests = len(pull_requests)
        print(f"Username: {username}, Number of Pull Requests: {num_pull_requests}")

        code_reviews = 0
        for pull_request in pull_requests:
            comments_url = pull_request["comments_url"]
            comments = requests.get(comments_url, headers=headers).json()
            code_reviews += len(comments)
        print(f"Username: {username}, Number of code reviews: {code_reviews}")

repo_link = "https://api.github.com/repos/hlakshm2/CSE564-Assignment04"
access_token = "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"
get_contributor_stats(repo_link, access_token)
