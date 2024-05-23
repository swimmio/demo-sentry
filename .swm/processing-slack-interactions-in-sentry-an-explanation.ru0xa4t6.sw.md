---
title: 'Processing Slack Interactions In Sentry: An Explanation'
---
This document will cover how Sentry processes interactions from Slack. We'll cover:

1. How Sentry uses the SlackClient
2. How Sentry handles Slack commands
3. How Sentry sends notifications to Slack

<SwmSnippet path="/src/sentry/integrations/slack/endpoints/event.py" line="9">

---

# How Sentry uses the SlackClient

Sentry uses the `SlackClient` to interact with Slack. This client is imported from `sentry.integrations.slack.client` and is used in various parts of the codebase to send requests to Slack.

```python
from sentry import analytics, features
from sentry.integrations.slack.client import SlackClient
from sentry.integrations.slack.message_builder.help import SlackHelpMessageBuilder
from sentry.integrations.slack.message_builder.prompt import SlackPromptLinkMessageBuilder
from sentry.integrations.slack.requests.base import SlackDMRequest, SlackRequestError
from sentry.integrations.slack.requests.event import COMMANDS, SlackEventRequest
from sentry.integrations.slack.unfurl import LinkType, UnfurlableUrl, link_handlers, match_link
from sentry.integrations.slack.views.link_identity import build_linking_url
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/requests/event.py" line="8">

---

# How Sentry handles Slack commands

Sentry defines a list of commands that it can handle from Slack. These commands include 'link', 'unlink', 'link team', and 'unlink team'. When a command is received from Slack, Sentry checks if it is in this list of commands and handles it accordingly.

```python
COMMANDS = ["link", "unlink", "link team", "unlink team"]
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/notifications.py" line="10">

---

# How Sentry sends notifications to Slack

Sentry uses the `post_message` function from `sentry.integrations.slack.tasks` to send notifications to Slack. This function takes a message and sends it to a specified Slack channel.

```python
from sentry.constants import ObjectStatus
from sentry.integrations.mixins import NotifyBasicMixin
from sentry.integrations.slack.client import SlackClient
from sentry.integrations.slack.message_builder import SlackAttachment
from sentry.integrations.slack.message_builder.notifications import get_message_builder
from sentry.integrations.slack.tasks import post_message
from sentry.models import ExternalActor, Identity, Integration, Organization, Team, User
from sentry.notifications.additional_attachment_manager import get_additional_attachment
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
