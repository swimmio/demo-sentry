---
title: Getting started with GitLab
---
GitLab is a web-based DevOps lifecycle tool that provides a Git-repository manager providing wiki, issue-tracking and continuous integration/continuous deployment pipeline features. In the context of the `demo-sentry` repository, GitLab is integrated to provide several features. The `GitlabIntegrationProvider` class in `src/sentry/integrations/gitlab/integration.py` is the main entry point for this integration. It connects a Sentry organization to a GitLab instance, enabling features like tracking commits and releases, resolving Sentry issues via GitLab commits and merge requests, and creating GitLab issues from Sentry. The `GitLabApiClient` class in `src/sentry/integrations/gitlab/client.py` is used to interact with the GitLab API. It handles tasks like getting user and group information, searching for projects, and handling issues. The `GitlabIntegration` class in `src/sentry/integrations/gitlab/integration.py` represents the installed integration and is used to perform actions like getting repositories, formatting source URLs, and searching for projects and issues.

<SwmSnippet path="/src/sentry/integrations/gitlab/integration.py" line="32">

---

# GitLab Integration in Sentry

This file defines the GitLab integration in Sentry. It includes the description of the integration, its features, and metadata. The `GitlabIntegration` class is the main class for the integration, which includes methods for getting repositories, formatting source URLs, searching projects and issues, and error handling.

```python
DESCRIPTION = """
Connect your Sentry organization to an organization in your GitLab instance or gitlab.com, enabling the following features:
"""

FEATURES = [
    FeatureDescription(
        """
        Track commits and releases (learn more
        [here](https://docs.sentry.io/learn/releases/))
        """,
        IntegrationFeatures.COMMITS,
    ),
    FeatureDescription(
        """
        Resolve Sentry issues via GitLab commits and merge requests by
        including `Fixes PROJ-ID` in the message
        """,
        IntegrationFeatures.COMMITS,
    ),
    FeatureDescription(
        """
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/gitlab/client.py" line="12">

---

# GitLab API Client

This file defines the API client for GitLab. It includes methods for making requests to various GitLab API endpoints, such as getting a user, searching projects, getting a project, creating an issue, creating an issue comment, and more. The `GitLabApiClient` class is the main class for the API client, which is initialized with an installation instance and includes methods for making requests to the GitLab API.

```python
API_VERSION = "/api/v4"


class GitLabApiClientPath:
    oauth_token = "/oauth/token"
    commit = "/projects/{project}/repository/commits/{sha}"
    commits = "/projects/{project}/repository/commits"
    compare = "/projects/{project}/repository/compare"
    diff = "/projects/{project}/repository/commits/{sha}/diff"
    file = "/projects/{project}/repository/files/{path}"
    group = "/groups/{group}"
    group_projects = "/groups/{group}/projects"
    hooks = "/hooks"
    issue = "/projects/{project}/issues/{issue}"
    issues = "/projects/{project}/issues"
    notes = "/projects/{project}/issues/{issue_id}/notes"
    project = "/projects/{project}"
    project_issues = "/projects/{project}/issues"
    project_hooks = "/projects/{project}/hooks"
    project_hook = "/projects/{project}/hooks/{hook_id}"
    project_search = "/projects/{project}/search"
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/gitlab/search.py" line="1">

---

# GitLab Issue Search Endpoint

This file defines the GitLab issue search endpoint in Sentry. The `GitlabIssueSearchEndpoint` class inherits from `IntegrationEndpoint` and includes a `get` method for handling GET requests to the endpoint. This method retrieves the integration instance, validates the request parameters, and performs a search for GitLab issues or projects based on the provided field and query.

```python
from rest_framework.request import Request
from rest_framework.response import Response

from sentry.api.bases.integration import IntegrationEndpoint
from sentry.models import Integration
from sentry.shared_integrations.exceptions import ApiError


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
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
