---
title: Introduction to Jira Server Integration
---
Jira Server Integration in the Sentry application is a feature that allows the application to connect with a Jira Server instance. This integration streamlines the bug tracking workflow by unifying Sentry and Jira instances. It provides features like creating and linking Sentry issue groups directly to a Jira ticket, automatic synchronization of assignees between Sentry and Jira, and synchronization of comments on Sentry Issues directly to the linked Jira ticket. The `JiraServerIntegration` class in `src/sentry/integrations/jira_server/integration.py` is the main class responsible for this integration. It is used by the `JiraServerIntegrationProvider` class to set up the integration. The integration is enabled in the Sentry server configuration in `src/sentry/conf/server.py`.

<SwmSnippet path="/src/sentry/integrations/jira_server/webhooks.py" line="44">

---

# Jira Server Integration Endpoints

The `JiraIssueUpdatedWebhook` class defines an endpoint for handling updates to Jira issues. It inherits from the `Endpoint` class. The `post` method is used to handle POST requests to this endpoint. The method extracts a token from the request, validates it, and retrieves the corresponding integration. It then checks for a changelog in the request data and handles changes to the assignee and status of the issue. If any errors occur during this process, an appropriate response is returned.

```python
class JiraIssueUpdatedWebhook(Endpoint):
    authentication_classes = ()
    permission_classes = ()

    @csrf_exempt
    def dispatch(self, request: Request, *args, **kwargs) -> Response:
        return super().dispatch(request, *args, **kwargs)

    def post(self, request: Request, token, *args, **kwargs) -> Response:
        try:
            integration = get_integration_from_token(token)
        except ValueError as err:
            logger.info("token-validation-error", extra={"token": token, "error": str(err)})
            return self.respond(status=400)

        data = request.data

        if not data.get("changelog"):
            logger.info("missing-changelog", extra={"integration_id": integration.id})
            return self.respond()

```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/jira_server/webhooks.py" line="17">

---

# Token Validation and Integration Retrieval

The `get_integration_from_token` function is used to validate the token received in the request and retrieve the corresponding integration. It first decodes the token and checks for an `id` claim. It then retrieves the integration with the matching `id` and validates the token using the integration's webhook secret. If any of these steps fail, a `ValueError` is raised.

```python
def get_integration_from_token(token):
    """
    When we create a jira server integration we create a webhook that contains
    a JWT in the URL. We use that JWT to locate the matching sentry integration later
    as Jira doesn't have any additional fields we can embed information in.
    """
    if not token:
        raise ValueError("Token was empty")

    try:
        unvalidated = jwt.peek_claims(token)
    except jwt.DecodeError:
        raise ValueError("Could not decode JWT token")
    if "id" not in unvalidated:
        raise ValueError("Token did not contain `id`")
    try:
        integration = Integration.objects.get(provider="jira_server", external_id=unvalidated["id"])
    except Integration.DoesNotExist:
        raise ValueError("Could not find integration for token")
    try:
        jwt.decode(token, integration.metadata["webhook_secret"])
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
