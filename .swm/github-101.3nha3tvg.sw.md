---
title: GitHub 101
---
GitHub is a web-based hosting service for version control using Git. It is used for software development and other version control tasks. In the context of the `demo-sentry` repository, GitHub is integrated into the Sentry application through the `sentry_plugins/github` directory. This integration allows Sentry to interact with GitHub repositories, issues, and handle webhooks for real-time updates. The `GitHubPlugin` class is used to define the GitHub integration, including its title, description, and slug. The `GitHubRepositoryProvider` and `GitHubAppsRepositoryProvider` classes are used to manage GitHub repositories within Sentry. They handle tasks such as linking authentication, adding organizations, and managing repositories. The `get_jwt` function in `client.py` is used to generate a JSON Web Token (JWT) for secure communication with GitHub's API.

<SwmSnippet path="/src/sentry_plugins/github/client.py" line="16">

---

# GitHub API Endpoints

The `GitHubClientMixin` and `GitHubClient` classes define several methods that correspond to GitHub API endpoints. For example, `get_last_commits` fetches the last \~30 commits from a repository, `compare_commits` compares two commits, and `get_pr_commits` lists commits on a pull request. The `GitHubClient` class also defines methods for getting a repository (`get_repo`), getting an issue (`get_issue`), creating an issue (`create_issue`), creating a comment (`create_comment`), listing assignees (`list_assignees`), searching issues (`search_issues`), and managing hooks (`create_hook`, `update_hook`, `delete_hook`).

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

<SwmSnippet path="/src/sentry_plugins/github/client.py" line="33">

---

# GitHub API Authentication

The `GitHubClient` class inherits from `AuthApiClient`, which handles authentication for API requests. The `request_no_auth` method allows making requests without authentication. The `GitHubAppsClient` class, which also inherits from `GitHubClientMixin`, uses JSON Web Tokens (JWT) for authentication (`get_jwt` method) and manages access tokens (`get_token` and `create_token` methods).

```python
class GitHubClient(GitHubClientMixin, AuthApiClient):
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
