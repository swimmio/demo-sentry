---
title: Getting started with GitLab
---
GitLab is a web-based DevOps lifecycle tool that provides a Git-repository manager providing wiki, issue-tracking and continuous integration/continuous deployment pipeline features. In the context of the `demo-sentry` repository, GitLab is integrated through the `GitLabPlugin` class located in `src/sentry_plugins/gitlab/plugin.py`. This plugin allows Sentry to interact with GitLab by linking a repository to a project, tracking commits and releases, resolving Sentry issues via GitLab commits and merge requests, creating GitLab issues from Sentry, and linking Sentry issues to existing GitLab issues. The `GitLabClient` class in `src/sentry_plugins/gitlab/client.py` is used to make API requests to GitLab.

<SwmSnippet path="/src/sentry_plugins/gitlab/client.py" line="7">

---

# GitLabClient Class

The `GitLabClient` class is a wrapper around the GitLab API. It is initialized with a base URL and a token, which are used to make authenticated requests to the GitLab API. The class defines several methods that correspond to different endpoints of the GitLab API, such as `auth`, `get_project`, `get_issue`, `create_issue`, `create_note`, and `list_project_members`. Each of these methods makes a specific type of request (GET or POST) to a specific path on the GitLab API.

```python
class GitLabClient(ApiClient):
    allow_redirects = False
    plugin_name = "gitlab"

    def __init__(self, url, token):
        super().__init__()
        self.base_url = url
        self.token = token

    def build_url(self, path):
        return "{}/api/v4/{}".format(self.base_url, path.lstrip("/"))

    def request(self, method, path, data=None, params=None):
        headers = {"Private-Token": self.token}
        return self._request(method, path, headers=headers, params=params, data=data)

    def auth(self):
        return self.request("GET", "/user")

    def get_project(self, repo):
        return self.request("GET", "/projects/{}".format(quote(repo, safe="")))
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/gitlab/client.py" line="23">

---

# GitLab API Endpoints

The `auth` method makes a GET request to the `/user` endpoint to authenticate the user. The `get_project` method makes a GET request to the `/projects/{repo}` endpoint to retrieve a specific project. The `get_issue` method makes a GET request to the `/projects/{repo}/issues/{issue_id}` endpoint to retrieve a specific issue. The `create_issue` method makes a POST request to the `/projects/{repo}/issues` endpoint to create a new issue. The `create_note` method makes a POST request to the `/projects/{repo}/issues/{issue_iid}/notes` endpoint to create a new note. The `list_project_members` method makes a GET request to the `/projects/{repo}/members/all/?per_page=100` endpoint to list all members of a project.

```python
    def auth(self):
        return self.request("GET", "/user")

    def get_project(self, repo):
        return self.request("GET", "/projects/{}".format(quote(repo, safe="")))

    def get_issue(self, repo, issue_id):
        try:
            return self.request(
                "GET", "/projects/{}/issues/{}".format(quote(repo, safe=""), issue_id)
            )
        except IndexError:
            raise ApiError("Issue not found with ID", 404)

    def create_issue(self, repo, data):
        return self.request("POST", "/projects/{}/issues".format(quote(repo, safe="")), data=data)

    def create_note(self, repo, issue_iid, data):
        return self.request(
            "POST",
            "/projects/{}/issues/{}/notes".format(quote(repo, safe=""), issue_iid),
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
