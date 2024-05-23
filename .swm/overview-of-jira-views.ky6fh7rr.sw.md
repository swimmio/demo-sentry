---
title: Overview of Jira Views
---
Jira Views in the Sentry integration are classes that handle the interaction between Sentry and Jira. They are responsible for rendering the UI and handling requests. For example, `JiraUiHookView` is a class that handles the UI for Jira configuration in Sentry. It extends from `JiraBaseHook` which provides a method `get_response` for rendering responses. Another class, `JiraIssueHookView`, handles the interaction with Jira issues. It provides methods for handling groups of issues and dispatching requests. Lastly, `JiraExtensionConfigurationView` is a class that sets up the provider for the Jira integration.

<SwmSnippet path="/src/sentry/integrations/jira/views/issue_hook.py" line="86">

---

# JiraIssueHookView Class

The `JiraIssueHookView` class is a key part of the integration between Sentry and Jira. It defines the behavior of the webhook that communicates between the two systems. The class inherits from `JiraBaseHook` and overrides several methods to provide specific functionality. The `handle_groups` method is used to process groups of issues, while the `dispatch` method handles the dispatching of requests. The `get` method is used to handle GET requests, which includes error handling for various exceptions that might occur during the process.

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

<SwmSnippet path="/src/sentry/integrations/jira/views/issue_hook.py" line="51">

---

# Building Context for Groups

The `build_context` function is used to construct the context for a group of issues. This context includes information about the type of error, the title of the group, the first and last seen times, the first and last releases, and statistics for the last 24 hours and 14 days. This context is then used in the `handle_groups` method of the `JiraIssueHookView` class to append each group's context to the response context.

```python
def build_context(group: Group) -> Mapping[str, Any]:
    result, stats_24hr = get_serialized_and_stats(group, "24h")
    _, stats_14d = get_serialized_and_stats(group, "14d")

    first_release = group.get_first_release()
    if first_release is not None:
        last_release = group.get_last_release()
    else:
        last_release = None

    first_release_url = None
    if first_release:
        first_release_url = get_release_url(group, first_release)

    last_release_url = None
    if last_release:
        last_release_url = get_release_url(group, last_release)

    group_url = group.get_absolute_url(params={"referrer": "sentry-issues-glance"})

    return {
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
