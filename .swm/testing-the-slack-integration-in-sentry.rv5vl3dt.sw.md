---
title: Testing The Slack Integration In Sentry
---
This document will cover the process of testing the Slack integration in the demo-sentry repository. We'll cover:

1. The structure of the Slack integration tests
2. Key components involved in the Slack integration tests.

<SwmSnippet path="/tests/sentry/integrations/slack/test_integration.py" line="69">

---

# Structure of the Slack Integration Tests

The `SlackIntegration` class in `test_integration.py` is a key component in testing the Slack integration. It contains methods like `get_config_data` and `uninstall` which are crucial for the testing process.

```python
                        "profile": {
                            "email": self.user.email,
                            "team": team_id,
                        },
                    },
                ],
                "response_metadata": {"next_cursor": ""},
            },
        )
        responses.add(
            responses.GET,
            "https://slack.com/api/team.info",
            json={
                "ok": True,
                "team": {
                    "domain": "test-slack-workspace",
                    "icon": {"image_132": "http://example.com/ws_icon.jpg"},
                },
            },
        )
        resp = self.client.get(
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/integration.py" line="93">

---

# Key Components Involved in the Slack Integration Tests

The `SlackIntegrationProvider` class in `integration.py` is another important component in the testing process. It contains the necessary metadata and scopes for the Slack integration.

```python
class SlackIntegrationProvider(IntegrationProvider):  # type: ignore
    key = "slack"
    name = "Slack"
    metadata = metadata
    features = frozenset([IntegrationFeatures.CHAT_UNFURL, IntegrationFeatures.ALERT_RULE])
    integration_cls = SlackIntegration

    # some info here: https://api.slack.com/authentication/quickstart
    identity_oauth_scopes = frozenset(
        [
            "channels:read",
            "groups:read",
            "users:read",
            "chat:write",
            "links:read",
            "links:write",
            "team:read",
            "im:read",
            "im:history",
            "chat:write.public",
            "chat:write.customize",
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
