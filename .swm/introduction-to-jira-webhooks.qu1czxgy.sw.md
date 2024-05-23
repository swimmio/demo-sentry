---
title: Introduction to Jira Webhooks
---
Jira Webhooks in the context of the `demo-sentry` repository are used to handle updates and changes to issues in Jira. They are part of the Jira integration in Sentry. When an issue is updated in Jira, a webhook is triggered and the `JiraIssueUpdatedWebhook` class handles this event. It processes the data from the request, checks for changes in the issue's status or assignee, and updates the corresponding Sentry issue accordingly. The `JiraSearchEndpoint` class is another part of the Jira integration that interacts with Jira's REST API to search for issues. The `JiraInstalledEndpoint` class handles the installation of the Jira integration, ensuring that the integration is correctly set up and that the necessary metadata is synced from Jira.

<SwmSnippet path="/src/sentry/integrations/jira/webhooks/descriptor.py" line="20">

---

# JiraDescriptorEndpoint

The `JiraDescriptorEndpoint` class defines an endpoint that provides metadata about the Sentry integration for Jira. This includes the name, description, key, baseUrl, vendor, authentication type, lifecycle events, apiVersion, modules, apiMigrations, and scopes. The `get` method responds with this metadata when a GET request is made to this endpoint.

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

<SwmSnippet path="/src/sentry/integrations/jira/webhooks/base.py" line="18">

---

# JiraEndpointBase

The `JiraEndpointBase` class is an abstract base class for Jira webhook endpoints. It defines common behavior for these endpoints, such as handling exceptions and extracting the token from the request. The `dispatch` method is decorated with `csrf_exempt`, which means that cross-site request forgery protection is disabled for this endpoint.

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

# JiraSearchEndpoint

The `JiraSearchEndpoint` class defines an endpoint for searching Jira issues, users, and field autocomplete suggestions. The `get` method handles GET requests to this endpoint. It first retrieves the integration and installation for the given organization and integration_id. Then, depending on the `field` parameter in the request, it performs a search for issues, users, or field autocomplete suggestions, and responds with the search results.

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

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
