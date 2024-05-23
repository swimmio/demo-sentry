---
title: Basic concepts of GitHub Integration
---
GitHub Integration in the Sentry repository is a feature that allows Sentry to interact with GitHub. It enables Sentry to augment issues with commits from GitHub repositories, link GitHub issues and pull requests directly to issues in Sentry, and even link Sentry stack traces back to GitHub source code. This integration is implemented in the `GitHubIntegrationProvider` class in `src/sentry/integrations/github/integration.py`. The class uses the `GitHubIntegration` class to interact with GitHub's API. For example, it uses the `get_jwt` function to generate a JWT for authentication with GitHub's API. The integration also provides features like repository search and code owners tracking.

<SwmSnippet path="/src/sentry/integrations/github/integration.py" line="90">

---

# GitHub Integration Endpoints

The `GitHubIntegration` class in `integration.py` defines several methods that interact with GitHub's API. For instance, `get_repositories` retrieves a list of repositories, `search_issues` searches for issues in a repository, and `has_repo_access` checks if the integration has access to a specific repository. These methods essentially define the endpoints for the GitHub integration.

```python
class GitHubIntegration(IntegrationInstallation, GitHubIssueBasic, RepositoryMixin):  # type: ignore
    repo_search = True
    codeowners_locations = ["CODEOWNERS", ".github/CODEOWNERS", "docs/CODEOWNERS"]

    def get_client(self) -> GitHubClientMixin:
        return GitHubAppsClient(integration=self.model)

    def get_repositories(self, query: str | None = None) -> Sequence[Mapping[str, Any]]:
        if not query:
            return [
                {"name": i["name"], "identifier": i["full_name"]}
                for i in self.get_client().get_repositories()
            ]

        full_query = build_repository_query(self.model.metadata, self.model.name, query)
        response = self.get_client().search_repositories(full_query)
        return [
            {"name": i["name"], "identifier": i["full_name"]} for i in response.get("items", [])
        ]

    def search_issues(self, query: str) -> Mapping[str, Sequence[Mapping[str, Any]]]:
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/github/repository.py" line="14">

---

# GitHub Repository Provider

The `GitHubRepositoryProvider` class in `repository.py` provides methods for interacting with GitHub repositories. It validates repositories, retrieves repository data, builds repository configurations, and compares commits. These methods are used to fetch and manipulate data from GitHub repositories, serving as endpoints for the GitHub integration.

```python
class GitHubRepositoryProvider(IntegrationRepositoryProvider):  # type: ignore
    name = "GitHub"
    repo_provider = "github"

    def _validate_repo(
        self, client: Any, installation: IntegrationInstallation, repo: str
    ) -> JSONData:
        try:
            repo_data = client.get_repo(repo)
        except Exception as e:
            raise installation.raise_error(e)

        try:
            # make sure installation has access to this specific repo
            # use hooks endpoint since we explicitly ask for those permissions
            # when installing the app (commits can be accessed for public repos)
            # https://developer.github.com/v3/repos/hooks/#list-hooks
            client.repo_hooks(repo)
        except ApiError:
            raise IntegrationError(f"You must grant Sentry access to {repo}")

```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
