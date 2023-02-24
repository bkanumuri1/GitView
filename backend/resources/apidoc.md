### Requirements to discover the GitHub endpoints

##### User dashboard 
	a. User name
		- Endpoint: GET /user 
	
	b. Dropdown lists repos user is a collaborator of
		- Endpoint: GET /user/repos?type=owner,member

	c. Search bar gets a specific repo user is a collaborator of 
		- Endpoint: GET /user/repos?type=owner,member&q=<query>

##### Repository dashboard 

###### All contributors section: 
	i. List of all contributors for a repo
		- Endpoint: GET /repos/:owner/:repo/collaborators

	ii. List of all commits for a repo
		- Endpoint: GET /repos/:owner/:repo/commits

	iii. Get details of a specific commit
		- Endpoint: GET /repos/:owner/:repo/commits/:commit_sha

	iv. List of all PRs in a repo
		- Endpoint: GET /repos/:owner/:repo/pulls

	v. Details of a specific PR
		- Endpoint: GET /repos/:owner/:repo/pulls/:pull_number

	vi. List of all branches in a repo
		- Endpoint: GET /repos/:owner/:repo/branches

	vii. Commit activity for a repo
		- Endpoint: GET /repos/{owner}/{repo}/stats/commit_activity

	viii. Code frequency for a repo
		- Endpoint: GET /repos/{owner}/{repo}/stats/code_frequency

	ix. Weekly commit count for a repo
		- Endpoint: GET /repos/{owner}/{repo}/stats/participation

	x. Number of additions and deletions per week for a repo
		- Endpoint: GET /repos/{owner}/{repo}/stats/weekly_commit_count

	xi. Contributors list with additions, deletions and commit counts
		- Endpoint: GET /repos/{owner}/{repo}/stats/contributors

	xii. List PRs associated with a commit
		- Endpoint: GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls

	xiii. Get reviews for a PR
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews

	xiv. Get commits on a PR
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/commits

	xv. Get a specific branch for a repo
		- Endpoint: GET /repos/{owner}/{repo}/branches/{branch_name}

	xvi. Get a list of all commits made on a branch
		- Endpoint: GET /repos/{owner}/{repo}/commits?sha={branch_name}

	xvii. Get a contributor's weekly commit count, addition, deletion of loc
		- Endpoint: GET /repos/{owner}/{repo}/stats/contributors?author={contributor_username}

	xviii. Get a contributors weekly commit count
		- Endpoint: GET /repos/{owner}/{repo}/stats/commit_activity?author={contributor_username}

	xix. Get the weekly participation stats for a specific contributor
		- Endpoint: GET /repos/{owner}/{repo}/stats/participation?author={contributor_username}


###### Individual contributors section:
	i. Commits made by a contributor 
		- Endpoint: GET /repos/:owner/:repo/commits?author=:username

	ii. Pull requests made by a contributor 
		- Endpoint: GET /repos/:owner/:repo/pulls?state=all&creator=:username

	iii. Code reviews done on PRs by a contributor
		- Endpoint: GET /repos/:owner/:repo/pulls?state=all&reviewer=:username

	iv. Comments on code reviews made by a contributor
		- Endpoint: GET /repos/:owner/:repo/pulls/:pull_number/reviews/comments?user=:username

	v. Branches in a repo
		- Endpoint: GET /repos/:owner/:repo/branches

	vi. Branch merges done by a contributor
		- Endpoint: GET /repos/:owner/:repo/commits?author=:username&merges=true

	vii. Commits that have been merged into the default branch (main/master)
		- Endpoint: GET /repos/:owner/:repo/commits?sha=:default_branch&author=:username

	viii. Code changes made by contributor on a PR 
		- Endpoint:	GET /repos/:owner/:repo/pulls/:pull_number/files?author=:username

	ix. List of all review comments for a specific PR
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/comments

	x. Get details of a specific commit
		- Endpoint: GET /repos/:owner/:repo/commits/:commit_sha

	xi. Get the merge status for a PR
		- Endpoint: GET /repos/{owner}/{repo}/pulls/{pull_number}/merge

	xii. Getting the status of a specific commit
		- Endpoint: GET /repos/{owner}/{repo}/commits/{ref}/statuses


	


