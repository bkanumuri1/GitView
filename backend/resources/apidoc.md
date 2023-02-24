### Requirements to discover the GitHub endpoints

##### User dashboard 
	a. User name
		- Endpoint: GET /user 
		- Headers:
			+ Authorization: token <access_token>
		- Parameters: None
		- Body: Since this is a GET request, there is no request body required.

	b. Dropdown lists repos user is a collaborator of
		- Endpoint: GET /user/repos?type=owner,member
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ type: This parameter is optional and specifies the types of repositories to include in the response. In this case, the value is set to "owner,member", which means the response will include repositories that the authenticated user either owns or is a collaborator or member of.
		- Body: Since this is a GET request, there is no request body required.
		
	c. Search bar gets a specific repo user is a collaborator of 
		- Endpoint: GET /user/repos?type=owner,member&q=<query>
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ type: This parameter is optional and specifies the types of repositories to include in the response. In this case, the value is set to "owner,member", which means the response will include repositories that the authenticated user either owns or is a collaborator or member of.

			+ q: This parameter is required and specifies the search query. The search query can be a string that includes one or more keywords or search terms, and it is used to filter the results based on the repository name, description, or other attributes.
		- Body: Since this is a GET request, there is no request body required.

##### Repository dashboard 

###### All contributors section: 
	i. List of all contributors for a repo
		- Endpoint: GET /repos/:owner/:repo/collaborators
		- Headers:
			+Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.

	ii. List of all commits for a repo
		- Endpoint: GET /repos/:owner/:repo/commits
		- Headers:
			+Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ sha: This parameter is optional and specifies the SHA or branch name to start listing the commits from. If not specified, it defaults to the repository's default branch.
		- Body: Since this is a GET request, there is no request body required.

	iii. Get details of a specific commit
		- Endpoint: GET /repos/:owner/:repo/commits/:commit_sha
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			commit_sha: This parameter is required and specifies the SHA hash of the commit.
		- Body: Since this is a GET request, there is no request body required.

	iv. List of all PRs in a repo
		- Endpoint: GET /repos/:owner/:repo/pulls
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ state: This parameter is optional and specifies the state of the pull requests to retrieve. The possible values are "open", "closed", or "all". If not specified, it defaults to "open".
			+ base: This parameter is optional and specifies the name of the branch you want your changes pulled into. This can be in the form of a branch name, a tag, or a commit SHA. If not specified, all pull requests will be returned, regardless of the branch they target.
		- Body: Since this is a GET request, there is no request body required.

	v. Details of a specific PR
		- Endpoint: GET /repos/:owner/:repo/pulls/:pull_number
		-Headers:
			+Authorization: token <access_token>
		-Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ pull_number: This parameter is required and specifies the number of the pull request you want to retrieve.
		- Body: Since this is a GET request, there is no request body required.

	vi. List of all branches in a repo
		- Endpoint: GET /repos/:owner/:repo/branches
		- Headers:
			+ Authorization: token <access_token>
		-Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.

	vii. Commit activity for a repo
		- Endpoint: GET /repos/{owner}/{repo}/stats/commit_activity
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ Body: Since this is a GET request, there is no request body required.

	viii. Code frequency for a repo
		- Endpoint: GET /repos/{owner}/{repo}/stats/code_frequency
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.

	ix. Weekly commit count for a repo
		- Endpoint: GET /repos/{owner}/{repo}/stats/participation
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.

	x. Number of additions and deletions per week for a repo
		- Endpoint: GET /repos/{owner}/{repo}/stats/weekly_commit_count
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			- repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.

	xi. Contributors list with additions, deletions and commit counts
		- Endpoint: GET /repos/{owner}/{repo}/stats/contributors
		- Headers:
			Authorization: token <access_token>
		-Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.

	xii. List PRs associated with a commit
		- Endpoint: GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls
		- Headers:
			+Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.

	xiii. Get reviews for a PR
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews
		- Headers:
			+ Authorization: token <access_token>
		-Parameters:

			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.
		
	xiv. Get commits on a PR
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/commits
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ pull_number: This parameter is required and specifies the number that identifies the pull request.
		- Body: Since this is a GET request, there is no request body required.

	xv. Get a specific branch for a repo
		- Endpoint: GET /repos/{owner}/{repo}/branches/{branch_name}
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			branch_name: This parameter is required and specifies the name of the branch.
		- Body: Since this is a GET request, there is no request body required.

	xvi. Get a list of all commits made on a branch
		- Endpoint: GET /repos/{owner}/{repo}/commits?sha={branch_name}
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ sha: This parameter is optional and specifies the SHA or branch name to start listing commits from.
		- Body: Since this is a GET request, there is no request body required.

	xvii. Get a contributor's weekly commit count, addition, deletion of loc
		- Endpoint: GET /repos/{owner}/{repo}/stats/contributors?author={contributor_username}
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
		- Body: Since this is a GET request, there is no request body required.

	xviii. Get a contributors weekly commit count
		- Endpoint: GET /repos/{owner}/{repo}/stats/commit_activity?author={contributor_username}
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ author: This parameter is optional and specifies the username of the contributor to filter the results by.
		- Body: Since this is a GET request, there is no request body required.

	xix. Get the weekly participation stats for a specific contributor
		- Endpoint: GET /repos/{owner}/{repo}/stats/participation?author={contributor_username}
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ author: This parameter is optional and specifies the username of the contributor to filter the results by.
		- Body: Since this is a GET request, there is no request body required.


###### Individual contributors section:
	i. Commits made by a contributor 
		- Endpoint: GET /repos/:owner/:repo/commits?author=:username
		- Headers:
			+ Authorization: token <access_token>
		- Parameters:
			+ owner: This parameter is required and specifies the login or organization name that owns the repository.
			+ repo: This parameter is required and specifies the name of the repository.
			+ author: This parameter is optional and specifies the username of the contributor to filter the results by.
		- Body: Since this is a GET request, there is no request body required.

	ii. Pull requests made by a contributor 
		- Endpoint: GET /repos/:owner/:repo/pulls?state=all&creator=:username
		- Headers:
			+ Authorization: Token <personal_access_token>
		- Path parameters:
			+ owner (required): The account owner of the repository
			+ repo (required): The name of the repository
		- Query parameters:
			+ state (optional): Indicates the state of the pull requests to return. Can be "open", "closed", or "all". Default is "open".
			+ creator (optional): The username of the user who created the pull requests to return.
		- Body: This endpoint does not require a request body.

	iii. Code reviews done on PRs by a contributor
		- Endpoint: GET /repos/{owner}/{repo}/pulls?state=all&reviewer={username}
		- Headers
			+ Authorization: token [personal access token]
		- Parameters
			+ {owner}: The account owner of the repository
			+ {repo}: The name of the repository
			+ {state}: State of the pull request. This parameter can be either open, closed, or all to retrieve both open and closed pull request. Default is open.
			+ reviewer: The username of the reviewer assigned to the pull request.

	iv. Comments on code reviews made by a contributor
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/comments?user={username}
		- Headers:
			+ Authorization: token [personal access token]
		-Parameters:
			+ owner (required): The account owner of the repository
			+ repo (required): The name of the repository
			+ pull_number (required): The number that identifies the pull request
			+ username (required): The username of the user who created the review comments
		-Body:
			This endpoint does not require a request body.

	v. Branches in a repo
		- Endpoint: GET /repos/{owner}/{repo}/branches
		- Headers:
			+ Authorization: token [personal access token]
		- Body:
			+There is no request body for this endpoint.
		- Parameters:
			+ owner: The account owner of the repository.
			+ repo: The name of the repository.

	vi. Branch merges done by a contributor
		- Endpoint: GET /repos/:owner/:repo/commits?author=:username&merges=true
		- Headers:
			+ Authorization: token [personal access token]
		- Path parameters:
			+ owner: [string] the account owner of the repository
			+ repo: [string] the name of the repository
		- Query parameters:
			+ author: [string] filters the commits to only those by the specified author
			+ merges: [boolean] filters the commits to only those that are merge commits (true) or not merge commits (false or not specified)

	vii. Commits that have been merged into the default branch (main/master)
		- Endpoint: GET /repos/:owner/:repo/commits?sha=:default_branch&author=:username
		- Headers:

			+ This endpoint does not require any specific headers.

		- Body:

			+ This endpoint does not require a request body.

		- Parameters:

			+ owner - the account owner of the repository.
			+ repo - the name of the repository.
			+ default_branch - the name of the default branch for the repository.
			+ username - the username of the author of the commits.
			+ The following parameter is optional:
				+ per_page - the number of results to show per page. Default is 30.

		- Note that the {default_branch} parameter is optional, and if not provided, the default branch specified in the repository settings will be used.

	viii. Code changes made by contributor on a PR 
		- Endpoint:	GET /repos/:owner/:repo/pulls/:pull_number/files?author=:username
		- The required parameters for this endpoint are:
			+ owner: the username of the owner of the repository.
			+ repo: the name of the repository.
			+ pull_number: the number of the pull request.
			+ username: the username of the author of the modified files.
		-The required header is:
			+ Authorization: token <access_token>
		- Body: There is no body required for this endpoint.

	ix. List of all review comments for a specific PR
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/comments
		- Headers:

			+ This endpoint doesn't require any specific headers. However, you will need to authenticate your request with an access token or a personal access token.

		- Parameters:

			+ owner: The account owner of the repository.
			+ repo: The name of the repository.
			+ pull_number: The number that identifies the pull request you want to retrieve comments from. This is a required parameter.
		-Body:
			+ This endpoint doesn't require a request body.

	x. Get details of a specific commit
		- Endpoint: GET /repos/:owner/:repo/commits/:commit_sha
		- Headers:
			+ Accept: application/vnd.github.v3+json
		- Parameters:
			+ owner (required): The account owner of the repository.
			+ repo (required): The name of the repository.
			+ commit_sha (required): The SHA of the commit to retrieve.
		
	xi. Get the merge status for a PR
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/merge
		- Header: 
			+ Accept: This header specifies the media type(s) that are acceptable for the response. It can be set to application/vnd.github.VERSION.raw+json to retrieve the response in raw JSON format.
			+ Authorization: This header should contain a valid personal access token with the repo scope or an OAuth token with the repo scope.

		- Parameters:
			+ owner: The account owner of the repository.
			+ repo: The name of the repository.
			+ pull_number: The number of the pull request.

		-Request Body:
			+ This endpoint does not require a request body

	xii. Getting the status of a specific commit
		- Endpoint: GET /repos/{owner}/{repo}/commits/{ref}/statuses
		- Headers:
			+ Accept: application/vnd.github.v3+json
		-Path parameters:
			+ owner: The account owner of the repository
			+ repo: The name of the repository
			+ ref: The name of the commit or branch to get the status for
		-Query parameters:
			+ None
		-Body:
			+ None		


	


