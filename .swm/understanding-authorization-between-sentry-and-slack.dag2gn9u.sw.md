---
title: Understanding Authorization Between Sentry and Slack
---
This document will cover the process of how authorization is handled between Sentry and Slack, which includes:

1. The role of the Slack integration in Sentry
2. How the Slack client is used in the authorization process
3. The use of endpoints in managing authorizations

<SwmSnippet path="/src/sentry/integrations/slack/integration.py" line="27">

---

# The Role of the Slack Integration in Sentry

The Slack integration in Sentry is defined in this file. It includes features such as unfurling Sentry URLs within Slack and configuring rule-based Slack notifications. It also provides a description of the integration and its features.

```python
Channel = namedtuple("Channel", ["name", "id"])

DESCRIPTION = """
Connect your Sentry organization to one or more Slack workspaces, and start
getting errors right in front of you where all the action happens in your
office!
"""

FEATURES = [
    FeatureDescription(
        """
        Unfurls Sentry URLs directly within Slack, providing you context and
        actionability on issues right at your fingertips. Resolve, ignore, and assign issues with minimal context switching.
        """,
        IntegrationFeatures.CHAT_UNFURL,
    ),
    FeatureDescription(
        """
        Configure rule based Slack notifications to automatically be posted into a
        specific channel. Want any error that's happening more than 100 times a
        minute to be posted in `#critical-errors`? Setup a rule for it!
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/client.py" line="14">

---

# The Use of the Slack Client in the Authorization Process

The Slack client is imported in this file and is used in the authorization process. It is part of the `sentry.integrations.slack.client` module.

```python
class SlackClient(ApiClient):  # type: ignore
    allow_redirects = False
    integration_name = "slack"
    base_url = "https://slack.com/api"
    datadog_prefix = "integrations.slack"
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/api/endpoints/integrations/sentry_apps/authorizations.py" line="12">

---

# The Use of Endpoints in Managing Authorizations

This file contains the endpoints for managing authorizations. It includes the `APIUnauthorized` from the `sentry.coreapi` module which is used when an unauthorized API request is made.

```python
logger = logging.getLogger(__name__)


class SentryAppAuthorizationsEndpoint(SentryAppAuthorizationsBaseEndpoint):
    def post(self, request: Request, installation) -> Response:
        with sentry_sdk.configure_scope() as scope:
            scope.set_tag("organization", installation.organization_id)
            scope.set_tag("sentry_app_id", installation.sentry_app_id)
            scope.set_tag("sentry_app_slug", installation.sentry_app.slug)

            try:
                if request.json_body.get("grant_type") == GrantTypes.AUTHORIZATION:
                    token = GrantExchanger.run(
                        install=installation,
                        code=request.json_body.get("code"),
                        client_id=request.json_body.get("client_id"),
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
