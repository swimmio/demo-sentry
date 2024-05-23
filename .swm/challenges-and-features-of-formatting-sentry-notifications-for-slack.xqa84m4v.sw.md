---
title: Challenges and Features of Formatting Sentry Notifications for Slack
---
This document will cover the unique challenges and features in formatting Sentry notifications into Slack messages. We'll cover:

1. How Sentry sends messages to Slack channels
2. The role of the SlackClient and SlackAttachment in sending notifications
3. The process of sending Slack responses and handling errors

# Sending Messages to Slack Channels

Sentry sends messages to Slack channels with instructions on how to add Sentry to the channel. It also handles cases where it is unable to send messages to certain channels.

<SwmSnippet path="/src/sentry/integrations/slack/notifications.py" line="12">

---

# SlackClient and SlackAttachment

The `SlackClient` and `SlackAttachment` are used in the process of sending notifications. The `SlackClient` is responsible for the communication with Slack, while `SlackAttachment` is used to format the messages.

```python
from sentry.integrations.slack.client import SlackClient
from sentry.integrations.slack.message_builder import SlackAttachment
from sentry.integrations.slack.message_builder.notifications import get_message_builder
from sentry.integrations.slack.tasks import post_message
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/utils/notifications.py" line="48">

---

# Sending Slack Responses and Error Handling

The `send_slack_response` function is used to send responses to Slack. It handles different scenarios including when the user takes their time to link their Slack account, and we may no longer be able to respond, and we're not guaranteed able to post into the channel. It ignores 'Expired url' errors.

```python
def send_slack_response(
    integration: Integration, text: str, params: Mapping[str, str], command: str
) -> None:
    payload = {
        "replace_original": False,
        "response_type": "ephemeral",
        "text": text,
    }

    client = SlackClient()
    if params["response_url"]:
        path = params["response_url"]
        headers = {}

    else:
        # Command has been invoked in a DM, not as a slash command
        # we do not have a response URL in this case
        token = (
            integration.metadata.get("user_access_token") or integration.metadata["access_token"]
        )
        headers = {"Authorization": f"Bearer {token}"}
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
