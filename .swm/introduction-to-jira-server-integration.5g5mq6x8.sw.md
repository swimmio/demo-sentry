---
title: Introduction to Jira Server Integration
---
Jira Server Integration in the Sentry application is a feature that allows the application to connect with one or more Jira Server instances. This integration streamlines the bug squashing workflow by unifying Sentry and Jira instances. It provides features such as creating and linking Sentry issue groups directly to a Jira ticket in any of your projects, automatic synchronization of assignees to and from Jira, and synchronization of comments on Sentry Issues directly to the linked Jira ticket. The integration is implemented in the `JiraServerIntegration` class in `src/sentry/integrations/jira_server/integration.py`. The `JiraServerIntegrationProvider` class in the same file is responsible for providing the integration to the Sentry application.

<SwmSnippet path="/src/sentry/integrations/jira_server/webhooks.py" line="44">

---

# Jira Server Integration Endpoints

The `JiraIssueUpdatedWebhook` class defines an endpoint that handles updates to Jira issues. It is a subclass of `Endpoint` and overrides the `post` method. This method is called when a POST request is made to this endpoint. The `post` method takes in a `request` and a `token` as parameters. The `token` is used to get the corresponding integration using the `get_integration_from_token` function. If the token is valid and the integration exists, the method proceeds to handle changes in the assignee and status of the Jira issue. If any errors occur during this process, appropriate responses are returned.

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

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
