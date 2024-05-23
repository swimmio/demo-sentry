---
title: Basic concepts of Slack
---
Slack is a communication platform that is integrated into the Sentry application. In the context of the `demo-sentry` repository, the `src/sentry/integrations/slack` directory contains the code that manages the integration with Slack. This includes sending notifications to Slack channels, unfurling Sentry URLs within Slack for context and actionability, and setting up alert rules for automatic Slack notifications. The `SlackIntegrationProvider` class in `src/sentry/integrations/slack/integration.py` is the main entry point for the Slack integration, and it uses the `SlackRequest` class from `src/sentry/integrations/slack/requests/base.py` to encapsulate and validate requests from Slack. The `get_slack_data_by_user` function in `src/sentry/integrations/slack/utils/users.py` is used to fetch Slack data associated with a user, based on their email.

# Slack Integration in Sentry

The Slack integration in Sentry allows errors from Sentry to be posted directly into a Slack workspace. This integration provides context and actionability on issues right within Slack, allowing users to resolve, ignore, and assign issues without having to switch contexts. The integration is set up to handle different types of requests from Slack, including actions (like clicking a button in a Slack message) and events (like a new message in a channel).

<SwmSnippet path="/src/sentry/integrations/slack/client.py" line="14">

---

# SlackClient

The `SlackClient` class in `client.py` is a subclass of `ApiClient`. It is responsible for making HTTP requests to the Slack API. The `request` method is used to make a request to a specified path with optional headers, data, and parameters. The `track_response_data` method is used to track the response data from Slack API calls for monitoring purposes.

```python
class SlackClient(ApiClient):  # type: ignore
    allow_redirects = False
    integration_name = "slack"
    base_url = "https://slack.com/api"
    datadog_prefix = "integrations.slack"

    def track_response_data(
        self,
        code: Union[str, int],
        span: Transaction,
        error: Optional[str] = None,
        resp: Optional[Response] = None,
    ) -> None:
        try:
            span.set_http_status(int(code))
        except ValueError:
            span.set_status(code)

        span.set_tag("integration", "slack")

        is_ok = False
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/endpoints/base.py" line="23">

---

# Slack Endpoints

The `SlackDMEndpoint` class in `base.py` is a subclass of `Endpoint`. It defines the base functionality for handling direct message requests from Slack. The `post_dispatcher` method is responsible for validating the request and dispatching it to the appropriate handler based on the command received from Slack.

```python
class SlackDMEndpoint(Endpoint, abc.ABC):  # type: ignore
    def post_dispatcher(self, request: SlackDMRequest) -> Response:
        """
        All Slack commands are handled by this endpoint. This block just
        validates the request and dispatches it to the right handler.
        """
        command, args = request.get_command_and_args()

        if command in ["help", ""]:
            return self.respond(SlackHelpMessageBuilder().build())

        if command == "link":
            if not args:
                return self.link_user(request)

            if args[0] == "team":
                return self.link_team(request)

        if command == "unlink":
            if not args:
                return self.unlink_user(request)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/endpoints/action.py" line="125">

---

# Slack Actions

The `SlackActionEndpoint` class in `action.py` handles action requests from Slack. These are requests that are triggered by user actions in Slack, such as clicking a button in a message. The `post` method is the entry point for these requests, and it dispatches the request to the appropriate handler method based on the type of action.

```python
class SlackActionEndpoint(Endpoint):  # type: ignore
    authentication_classes = ()
    permission_classes = ()

    def respond_ephemeral(self, text: str) -> Response:
        return self.respond({"response_type": "ephemeral", "replace_original": False, "text": text})

    def api_error(
        self,
        slack_request: SlackActionRequest,
        group: Group,
        identity: Identity,
        error: ApiClient.ApiError,
        action_type: str,
    ) -> Response:
        logger.info(
            "slack.action.api-error",
            extra={
                **slack_request.get_logging_data(group),
                "response": str(error.body),
                "action_type": action_type,
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
