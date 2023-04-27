import unittest
from unittest.mock import patch
import json
from datetime import datetime, timedelta
from unittest.mock import MagicMock

import app

class TestApp(unittest.TestCase):

    def setUp(self):
        app.app.testing = True
        self.app = app.app.test_client()
        app.app.config['SECRET_KEY'] = 'test_secret_key'
        self.valid_token = 'valid_token'
        self.invalid_token = 'invalid_token'
        self.test_repo_name = 'test_repo_name'
        self.test_author = 'test_author'
        self.test_since = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        self.test_until = datetime.now().strftime('%Y-%m-%d')
        self.pull_request = {
            "title": "Test PR",
            "url": "https://github.com/example/repo/pull/1",
            "author": {"login": "testuser"},
            "state": "OPEN",
            "headRef": {"name": "feature-branch"},
            "baseRef": {"name": "main"},
            "reviews": {"nodes": [
                {"author": {"login": "reviewer1"}, "body": "LGTM"},
                {"author": {"login": "reviewer2"}, "body": "Needs work"}
            ]},
            "comments": {"nodes": [
                {"author": {"login": "commenter1"}, "body": "Looks good"},
                {"author": {"login": "commenter2"}, "body": "Needs more tests"}
            ]},
            "reviewRequests": {"nodes": [
                {"requestedReviewer": {"login": "reviewer3"}},
                {"requestedReviewer": {"login": "reviewer4"}}
            ]}, 
            "formatted_date": 'createdAt'
        }


    def tearDown(self):
        pass

    def test_get_access_token(self):
        with patch('requests.post') as mock_post:
            mock_post.return_value.json.return_value = {'access_token': 'test_token'}
            response = self.app.get('/getAccessToken?code=test_code')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {'access_token': 'test_token'})

    # def test_get_user_data_with_valid_token(self):
    #     with patch('requests.get') as mock_get:
    #         mock_get.return_value.json.return_value = {'login': 'test_username'}
    #         with self.app.session_transaction() as session:
    #             session['username'] = None
    #         response = self.app.get('/getUserData', headers={'Authorization': self.valid_token})
    #         self.assertEqual(response.status_code, 200)
    #         self.assertEqual(response.json, {'login': 'test_username'})
    #         with self.app.session_transaction() as session:
    #             self.assertEqual(session['username'], 'test_username')

    # def test_get_user_data_with_invalid_token(self):
    #     response = self.app.get('/getUserData', headers={'Authorization': self.invalid_token})
    #     self.assertEqual(response.status_code, 404)

    def test_get_repo_contributors_with_valid_token(self):
        with patch('requests.get') as mock_get:
            mock_get.return_value.status_code = 200
            mock_get.return_value.json.return_value = [{'node_id': 'test_id', 'login': 'test_user'}]
            response = self.app.get(f'/getRepoContributors?repo={self.test_repo_name}', headers={'Authorization': self.valid_token})
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, {'test_id': 'test_user'})

    def test_get_repo_contributors_with_invalid_token(self):
        response = self.app.get(f'/getRepoContributors?repo={self.test_repo_name}', headers={'Authorization': self.invalid_token})
        self.assertEqual(response.status_code, 404)

    def test_get_repo_contributors_with_nonexistent_repo(self):
        with patch('requests.get') as mock_get:
            mock_get.return_value.status_code = 404
            response = self.app.get('/getRepoContributors?repo=nonexistent_repo', headers={'Authorization': self.valid_token})
            self.assertEqual(response.status_code, 404)

    def test_get_commits_with_valid_token(self):
        with patch('requests.post') as mock_post:
            mock_post.return_value.json.side_effect = [
                {'data': {'repository': {'refs': {'pageInfo': {'hasNextPage': True, 'endCursor': 'test_cursor1'}, 'nodes': [{'name': 'test_branch1', 'target': {'history': {'pageInfo': {'hasNextPage': False}, 'nodes': [{'author': {'user': {'login': 'test_author1'}}, 'oid': 'test_oid1', 'committedDate': '2022-01-01T00:00:00'}]}}}]}}}}]
            
    def test_constructEachPullRequestEntry(self):
        pr_entry = app.constructEachPullRequestEntry(self.pull_request)
        self.assertEqual(pr_entry['title'], "Test PR")
        self.assertEqual(pr_entry['url'], "https://github.com/example/repo/pull/1")
        self.assertEqual(pr_entry['author'], "testuser")
        self.assertEqual(pr_entry['state'], "OPEN")
        self.assertEqual(pr_entry['headRef'], "feature-branch")
        self.assertEqual(pr_entry['baseRef'], "main")
        self.assertEqual(len(pr_entry['reviews']), 2)
        self.assertEqual(pr_entry['reviews'][0]['author'], "reviewer1")
        self.assertEqual(pr_entry['reviews'][0]['comment'], "LGTM")
        self.assertEqual(len(pr_entry['comments']), 2)
        self.assertEqual(pr_entry['comments'][0]['author'], "commenter1")
        self.assertEqual(pr_entry['comments'][0]['comment'], "Looks good")
        self.assertEqual(len(pr_entry['reviewers']), 2)
        self.assertEqual(pr_entry['reviewers'][0], "reviewer3")
        self.assertEqual(pr_entry['reviewers'][1], "reviewer4")

    def test_parsePullRequestData(self):
        mock_data = {
            "data": {
                "search": {
                    "nodes": [self.pull_request]
                }
            }
        }
        parsedPRList = {}
        app.parsePullRequestData(mock_data, parsedPRList)
        self.assertEqual(len(parsedPRList), 1)
        # self.assertEqual(len(parsedPRList['2023-04-12']), 1)
        # self.assertEqual(parsedPRList['2023-04-12'][0]['title'], "Test PR")

