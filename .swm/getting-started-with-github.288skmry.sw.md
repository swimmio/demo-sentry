---
title: Getting started with Github
---
GitHub is a web-based hosting service for version control using Git. It is used for software development and offers all of the distributed version control and source code management (SCM) functionality of Git as well as adding its own features. In the context of the `demo-sentry` repository, GitHub is used as an integration point for handling issues and code changes. The `src/sentry_plugins/github` directory contains the code that manages the integration with GitHub. This includes handling GitHub webhooks, managing GitHub applications, and linking GitHub repositories to Sentry projects. The code also handles various GitHub events such as push and pull requests, and manages the authentication and authorization with GitHub.

<SwmSnippet path="/src/sentry_plugins/github/client.py" line="16">

---

# GitHub API Endpoints

The `GitHubClientMixin` class defines several methods that interact with various GitHub API endpoints. For example, the `get_last_commits` method fetches the last \~30 commits from a specified repository using the `/repos/{repo}/commits` endpoint. Similarly, the `compare_commits` method compares two commits using the `/repos/{repo}/compare/{start_sha}...{end_sha}` endpoint. The `GitHubClient` class extends this mixin and adds additional methods for interacting with other endpoints, such as creating issues, creating comments, and managing hooks.

```python
    def get_last_commits(self, repo, end_sha):
        # return api request that fetches last ~30 commits
        # see https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
        # using end_sha as parameter
        return self.get(f"/repos/{repo}/commits", params={"sha": end_sha})

    def compare_commits(self, repo, start_sha, end_sha):
        # see https://developer.github.com/v3/repos/commits/#compare-two-commits
        # where start sha is oldest and end is most recent
        return self.get(f"/repos/{repo}/compare/{start_sha}...{end_sha}")

    def get_pr_commits(self, repo, num):
        # see https://developer.github.com/v3/pulls/#list-commits-on-a-pull-request
        # Max: 250 Commits
        return self.get(f"/repos/{repo}/pulls/{num}/commits")


class GitHubClient(GitHubClientMixin, AuthApiClient):
    def __init__(self, url=None, auth=None):
        if url is not None:
            self.base_url = url.rstrip("/")
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/github/client.py" line="34">

---

# GitHub API Authentication

The `GitHubClient` class also handles authentication for the GitHub API. The `request_no_auth` method is used to make requests without authentication, while the `__init__` method sets the base URL for the API and initializes the `AuthApiClient` superclass with the provided authentication.

```python
    def __init__(self, url=None, auth=None):
        if url is not None:
            self.base_url = url.rstrip("/")
        super().__init__(auth=auth)

    def request_no_auth(self, method, path, data=None, params=None):
        if params is None:
            params = {}

        return self._request(method, path, auth=None, data=data, params=params)
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
