---
title: >-
  Extending the Sentry-PagerDuty Integration to Support Additional PagerDuty API
  Features
---
This document will cover the process of extending the PagerDuty integration to support further features of the PagerDuty API. We'll cover:

1. Understanding the current integration
2. How to extend the integration

<SwmSnippet path="/src/sentry/integrations/pagerduty/integration.py" line="130">

---

# Understanding the current integration

The `PagerDutyIntegrationProvider` class is the main entry point for the PagerDuty integration. It defines the key features of the integration, such as alert rules and incident management.

```python
class PagerDutyIntegrationProvider(IntegrationProvider):
    key = "pagerduty"
    name = "PagerDuty"
    metadata = metadata
    features = frozenset([IntegrationFeatures.ALERT_RULE, IntegrationFeatures.INCIDENT_MANAGEMENT])
    integration_cls = PagerDutyIntegration
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/pagerduty/client.py" line="14">

---

# Extending the integration

The `PagerDutyClient` class is where the actual API calls to PagerDuty are made. To extend the integration with more features, you would add more methods to this class that make the necessary API calls.

```python
class PagerDutyClient(ApiClient):
    allow_redirects = False
    integration_name = "pagerduty"
    base_url = "https://events.pagerduty.com/v2/enqueue"

    def __init__(self, integration_key):
        self.integration_key = integration_key
        super().__init__()

    def request(self, method, path, headers=None, data=None, params=None):
        if not headers:
            headers = {"Content-Type": "application/json"}

        return self._request(method, path, headers=headers, data=data, params=params)

    def send_trigger(self, data):
        # expected payload: https://v2.developer.pagerduty.com/docs/send-an-event-events-api-v2
        if isinstance(data, Event):
            source = data.transaction or data.culprit or "<unknown>"
            group = data.group
            level = data.get_tag("level") or "error"
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
