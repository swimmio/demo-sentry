---
title: Getting started with Jira
---
Jira is a popular issue tracking and project management tool developed by Atlassian. In the context of the `demo-sentry` repository, Jira is integrated to streamline the bug tracking workflow. The integration allows Sentry to connect with one or more Jira cloud instances. This integration provides features such as creating and linking Sentry issue groups directly to a Jira ticket, automatic synchronization of assignees between Sentry and Jira, and synchronization of comments on Sentry issues directly to the linked Jira ticket. The Jira integration is implemented in the `src/sentry/integrations/jira` directory, with key classes like `JiraIntegrationProvider` and `JiraApiClient` and functions like `request_hook` and `search_url`.

<SwmSnippet path="/src/sentry/integrations/jira/views/issue_hook.py" line="86">

---

# Jira Integration in Sentry

This file defines the `JiraIssueHookView` class, which is a key part of the Jira integration. It handles the interaction between Sentry and Jira issues. The `dispatch` method is the main entry point for requests coming from Jira. The `get` method retrieves the integration details from the request, fetches the associated external issue, and handles the groups associated with the issue.

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

# Jira Webhooks

This file defines the `JiraEndpointBase` class, which is the base class for all Jira webhook endpoints. It handles exceptions and provides methods for dispatching requests and extracting tokens from requests. This is crucial for the communication between Sentry and Jira via webhooks.

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

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
