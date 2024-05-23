---
title: Understanding GitLab Integration
---
GitLab Integration in the Sentry application is a feature that allows Sentry to connect with a GitLab instance, enabling several functionalities. These functionalities include tracking commits and releases, resolving Sentry issues via GitLab commits and merge requests, and creating GitLab issues from Sentry. The `GitlabIntegrationProvider` class in `src/sentry/integrations/gitlab/integration.py` is the main class responsible for this integration. It contains metadata about the integration and a reference to the `GitlabIntegration` class, which handles the specifics of the integration, such as searching for projects and issues. This integration is enabled in the Sentry server configuration (`src/sentry/conf/server.py`).

<SwmSnippet path="/src/sentry/integrations/gitlab/search.py" line="9">

---

# GitLab Integration Endpoints

The `GitlabIssueSearchEndpoint` class defines an endpoint for searching issues in GitLab. It handles GET requests and requires `field` and `query` parameters. Depending on the `field` value, it either searches for issues or projects. If the `field` is 'externalIssue', it also requires a 'project' parameter. The search results are returned in a specific format.

```python
class GitlabIssueSearchEndpoint(IntegrationEndpoint):
    def get(self, request: Request, organization, integration_id) -> Response:
        try:
            integration = Integration.objects.get(
                organizations=organization, id=integration_id, provider="gitlab"
            )
        except Integration.DoesNotExist:
            return Response(status=404)

        field = request.GET.get("field")
        query = request.GET.get("query")
        if field is None:
            return Response({"detail": "field is a required parameter"}, status=400)
        if query is None:
            return Response({"detail": "query is a required parameter"}, status=400)

        installation = integration.get_installation(organization.id)

        if field == "externalIssue":
            project = request.GET.get("project")
            if project is None:
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/gitlab/integration.py" line="83">

---

The `GitlabIntegration` class defines methods for interacting with GitLab. It includes methods for getting repositories, formatting source URLs, searching projects and issues, and handling errors from GitLab API. It also includes a form for installation configuration.

```python
class GitlabIntegration(IntegrationInstallation, GitlabIssueBasic, RepositoryMixin):
    repo_search = True
    codeowners_locations = ["CODEOWNERS", ".gitlab/CODEOWNERS", "docs/CODEOWNERS"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.default_identity = None

    def get_group_id(self):
        return self.model.metadata["group_id"]

    def get_client(self):
        if self.default_identity is None:
            self.default_identity = self.get_default_identity()

        return GitLabApiClient(self)

    def get_repositories(self, query=None):
        # Note: gitlab projects are the same things as repos everywhere else
        group = self.get_group_id()
        resp = self.get_client().search_projects(group, query)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/gitlab/client.py" line="41">

---

The `GitLabApiClient` class defines methods for making requests to the GitLab API. It includes methods for getting user and group information, searching projects and issues, creating and deleting webhooks, getting commits and diffs, and checking and getting files.

```python
class GitLabSetupClient(ApiClient):
    """
    API Client that doesn't require an installation.
    This client is used during integration setup to fetch data
    needed to build installation metadata
    """

    integration_name = "gitlab_setup"

    def __init__(self, base_url, access_token, verify_ssl):
        super().__init__(verify_ssl)
        self.base_url = base_url
        self.token = access_token

    def get_group(self, group):
        """Get a group based on `path` which is a slug.

        We need to URL quote because subgroups use `/` in their
        `id` and GitLab requires slugs to be URL encoded.
        """
        group = quote(group, safe="")
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
