---
title: What is GitHub Enterprise Integration
---
GitHub Enterprise Integration in the Sentry application allows the Sentry organization to connect with on-premises GitHub Enterprise instances. This integration enhances Sentry issues with commits from your repositories and links your GitHub issues and pull requests directly to issues in Sentry. It authorizes repositories to be added to your Sentry organization to augment Sentry issues with commit data. It also allows creating and linking Sentry issue groups directly to a GitHub issue or pull request in any of your repositories. The integration is defined in the `GitHubEnterpriseIntegrationProvider` class in the `src/sentry/integrations/github_enterprise/integration.py` file. This class is a provider for the GitHub Enterprise integration and is responsible for the integration's setup, installation, and functionality.

<SwmSnippet path="/src/sentry/integrations/github_enterprise/integration.py" line="106">

---

# GitHub Enterprise Integration

The `GitHubEnterpriseIntegration` class is the main class for the GitHub Enterprise integration. It includes methods like `get_client` to get the GitHub Enterprise Apps client, `get_repositories` to fetch repositories, `search_issues` to search for issues, and `reinstall` to reinstall the integration.

```python
class GitHubEnterpriseIntegration(IntegrationInstallation, GitHubIssueBasic, RepositoryMixin):
    repo_search = True

    def get_client(self):
        base_url = self.model.metadata["domain_name"].split("/")[0]
        return GitHubEnterpriseAppsClient(
            base_url=base_url,
            integration=self.model,
            private_key=self.model.metadata["installation"]["private_key"],
            app_id=self.model.metadata["installation"]["id"],
            verify_ssl=self.model.metadata["installation"]["verify_ssl"],
        )

    def get_repositories(self, query=None):
        if not query:
            return [
                {"name": i["name"], "identifier": i["full_name"]}
                for i in self.get_client().get_repositories()
            ]

        full_query = build_repository_query(self.model.metadata, self.model.name, query)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/github_enterprise/client.py" line="6">

---

# GitHub Enterprise Apps Client

The `GitHubEnterpriseAppsClient` class is used to interact with the GitHub Enterprise API. It includes methods like `get_jwt` to get the JSON Web Token (JWT) and `create_token` to create an access token.

```python
class GitHubEnterpriseAppsClient(GitHubClientMixin):
    base_url = None
    integration_name = "github_enterprise"

    def __init__(self, base_url, integration, app_id, private_key, verify_ssl):
        self.base_url = f"https://{base_url}/api/v3"
        self.integration = integration
        self.app_id = app_id
        self.private_key = private_key
        super().__init__(verify_ssl=verify_ssl)

    def get_jwt(self):
        return get_jwt(github_id=self.app_id, github_private_key=self.private_key)

    def create_token(self):
        headers = {
            # TODO(jess): remove this whenever it's out of preview
            "Accept": "application/vnd.github.machine-man-preview+json",
        }
        headers.update(jwt.authorization_header(self.get_jwt()))
        return self.post(
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
