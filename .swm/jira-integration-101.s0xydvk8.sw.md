---
title: Jira Integration 101
---
Jira Integration in the Sentry application is a feature that allows users to connect their Sentry organization to one or more of their Jira cloud instances. This integration aims to streamline the bug squashing workflow by unifying Sentry and Jira instances. It enables users to create and link Sentry issue groups directly to a Jira ticket in any of their projects, providing a quick way to jump from a Sentry bug to a tracked ticket. It also automatically synchronizes assignees and comments on Sentry Issues directly to the linked Jira ticket. The Jira Integration is implemented in the `JiraIntegrationProvider` class in the `src/sentry/integrations/jira/integration.py` file.

<SwmSnippet path="/src/sentry/integrations/jira/views/issue_hook.py" line="86">

---

# Jira Integration Endpoints

The `JiraIssueHookView` class in `issue_hook.py` defines the endpoint for handling Jira issue hooks. It includes methods for handling groups of issues (`handle_groups`), dispatching requests (`dispatch`), and handling GET requests (`get`). The `get` method retrieves the integration from the request, fetches the external issue, and handles the groups associated with the issue.

```python
class JiraIssueHookView(JiraBaseHook):
    html_file = "sentry/integrations/jira-issue.html"

    def handle_groups(self, groups: Sequence[Group]) -> Response:
        response_context = {"groups": []}
        for group in groups:
            context = build_context(group)
            response_context["groups"].append(context)

        logger.info(
            "issue_hook.response",
            extra={"issue_count": len(groups)},
        )

        return self.get_response(response_context)

    def dispatch(self, request: Request, *args, **kwargs) -> Response:
        try:
            return super().dispatch(request, *args, **kwargs)
        except ApiError as exc:
            # Sometime set_badge() will fail to connect.
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/jira/webhooks/base.py" line="18">

---

The `JiraEndpointBase` class in `base.py` provides a base for Jira webhook endpoints. It includes methods for dispatching requests (`dispatch`), handling exceptions (`handle_exception`), and getting the token from the request (`get_token`).

```python
class JiraEndpointBase(Endpoint, abc.ABC):
    authentication_classes = ()
    permission_classes = ()
    provider = "jira"

    @csrf_exempt
    def dispatch(self, request: Request, *args, **kwargs) -> Response:
        return super().dispatch(request, *args, **kwargs)

    def handle_exception(self, request: Request, exc: Exception) -> Response:
        if isinstance(exc, (AtlassianConnectValidationError, JiraTokenError)):
            return self.respond(status=status.HTTP_400_BAD_REQUEST)
        return super().handle_exception(request, exc)

    def get_token(self, request: Request) -> str:
        try:
            return request.META["HTTP_AUTHORIZATION"].split(" ", 1)[1]
        except (KeyError, IndexError):
            raise JiraTokenError

```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/jira/webhooks/search.py" line="13">

---

The `JiraSearchEndpoint` class in `search.py` defines the endpoint for Jira search. It includes a `get` method that handles GET requests, which fetches the integration, validates the field and query parameters, and performs the appropriate search based on the field.

```python
class JiraSearchEndpoint(IntegrationEndpoint):
    provider = "jira"

    def _get_integration(self, organization, integration_id):
        return Integration.objects.get(
            organizations=organization, id=integration_id, provider=self.provider
        )

    def get(self, request: Request, organization, integration_id) -> Response:
        try:
            integration = self._get_integration(organization, integration_id)
        except Integration.DoesNotExist:
            return Response(status=404)
        installation = integration.get_installation(organization.id)
        jira_client = installation.get_client()

        field = request.GET.get("field")
        query = request.GET.get("query")

        if field is None:
            return Response({"detail": "field is a required parameter"}, status=400)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/jira/webhooks/descriptor.py" line="20">

---

The `JiraDescriptorEndpoint` class in `descriptor.py` defines the endpoint for the Jira descriptor. It includes a `get` method that handles GET requests and returns the descriptor for the Jira integration.

```python
class JiraDescriptorEndpoint(Endpoint):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request: Request) -> Response:
        sentry_logo = absolute_uri(get_asset_url("sentry", "images/logos/logo-sentry.svg"))
        return self.respond(
            {
                "name": "Sentry",
                "description": "Connect your Sentry organization into one or more of your Jira cloud instances. Get started streamlining your bug squashing workflow by unifying your Sentry and Jira instances together.",
                "key": JIRA_KEY,
                "baseUrl": absolute_uri(),
                "vendor": {"name": "Sentry", "url": "https://sentry.io"},
                "authentication": {"type": "jwt"},
                "lifecycle": {
                    "installed": "/extensions/jira/installed/",
                    "uninstalled": "/extensions/jira/uninstalled/",
                },
                "apiVersion": 1,
                "modules": {
                    "postInstallPage": {
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/jira/client.py" line="72">

---

The `JiraApiClient` class in `client.py` provides the client for interacting with the Jira API. It includes methods for making requests (`request`), getting issues (`get_issue`), creating comments (`create_comment`), updating comments (`update_comment`), and other operations related to issues, projects, users, and fields in Jira.

```python
class JiraApiClient(ApiClient):
    # TODO: Update to v3 endpoints
    COMMENTS_URL = "/rest/api/2/issue/%s/comment"
    COMMENT_URL = "/rest/api/2/issue/%s/comment/%s"
    STATUS_URL = "/rest/api/2/status"
    CREATE_URL = "/rest/api/2/issue"
    ISSUE_URL = "/rest/api/2/issue/%s"
    META_URL = "/rest/api/2/issue/createmeta"
    PRIORITIES_URL = "/rest/api/2/priority"
    PROJECT_URL = "/rest/api/2/project"
    SEARCH_URL = "/rest/api/2/search/"
    VERSIONS_URL = "/rest/api/2/project/%s/versions"
    USERS_URL = "/rest/api/2/user/assignable/search"
    USER_URL = "/rest/api/2/user"
    SERVER_INFO_URL = "/rest/api/2/serverInfo"
    ASSIGN_URL = "/rest/api/2/issue/%s/assignee"
    TRANSITION_URL = "/rest/api/2/issue/%s/transitions"
    EMAIL_URL = "/rest/api/3/user/email"
    AUTOCOMPLETE_URL = "/rest/api/2/jql/autocompletedata/suggestions"
    PROPERTIES_URL = "/rest/api/3/issue/%s/properties/%s"

```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
