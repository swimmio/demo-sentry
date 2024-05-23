---
title: Understanding Slack Endpoints
---
Slack Endpoints in the `demo-sentry` repository are part of the Slack integration and are responsible for handling various interactions between the Sentry application and Slack. They are located in the `src/sentry/integrations/slack/endpoints/` directory. The main classes in this directory are `SlackActionEndpoint`, `SlackEventEndpoint`, and `SlackCommandsEndpoint`.

`SlackActionEndpoint` handles actions triggered from Slack such as assigning issues, changing issue status, and opening resolve dialogs.

`SlackEventEndpoint` handles events from Slack like messages, link sharing, and URL verification.

`SlackCommandsEndpoint` handles commands sent from Slack, such as linking and unlinking users or teams.

These endpoints interact with Slack's API to send and receive data, and they use the data to perform actions in the Sentry application or respond back to Slack. They are crucial for the functionality of the Slack integration in Sentry.

<SwmSnippet path="/src/sentry/integrations/slack/endpoints/base.py" line="23">

---

# Slack Endpoints in Sentry

The `SlackDMEndpoint` class in `base.py` is an abstract base class that defines the structure for direct message endpoints in Slack. It includes methods for linking and unlinking users and teams, as well as a dispatcher for handling different Slack commands. The `post_dispatcher` method is the entry point for all Slack commands, which are then routed to the appropriate handler based on the command type.

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

# Slack Action Endpoint

The `SlackActionEndpoint` class in `action.py` handles the actions triggered from Slack. It includes methods for responding to different types of actions, such as assigning issues, updating issue status, and handling member approval. Each action method updates the group or issue in Sentry based on the action taken in Slack.

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
