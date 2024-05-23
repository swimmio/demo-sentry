---
title: Introduction to PagerDuty
---
PagerDuty is an incident management platform that provides reliable notifications, automatic escalations, on-call scheduling, and other functionality to help teams detect and fix infrastructure problems quickly. In the context of the `demo-sentry` repo, the `PagerDutyIntegrationProvider` class in `src/sentry/integrations/pagerduty/integration.py` is used to integrate PagerDuty with Sentry. This integration allows Sentry to send notifications to PagerDuty, triggering incidents based on Sentry alerts. It also adds a new Alert Rule action to all projects, enabling automatic notifications to be sent to PagerDuty. The integration features include `ALERT_RULE` and `INCIDENT_MANAGEMENT`, which respectively allow configuring rule-based PagerDuty alerts and managing incidents by sending Sentry notifications to PagerDuty.

<SwmSnippet path="/src/sentry/integrations/pagerduty/client.py" line="14">

---

# PagerDutyClient Class

The `PagerDutyClient` class is an extension of the `ApiClient` class. It is initialized with an `integration_key` which is used for authenticating requests to the PagerDuty API. The `base_url` attribute is set to the PagerDuty API endpoint.

```python
class PagerDutyClient(ApiClient):
    allow_redirects = False
    integration_name = "pagerduty"
    base_url = "https://events.pagerduty.com/v2/enqueue"

    def __init__(self, integration_key):
        self.integration_key = integration_key
        super().__init__()
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/pagerduty/client.py" line="29">

---

# Sending Triggers to PagerDuty

The `send_trigger` method is used to send events to the PagerDuty API. It accepts an `Event` object or a payload for a metric alert. The method constructs a payload according to the PagerDuty API specifications and sends a POST request to the API endpoint. The `event_action` is set to `trigger` to indicate that this is a new event.

```python
    def send_trigger(self, data):
        # expected payload: https://v2.developer.pagerduty.com/docs/send-an-event-events-api-v2
        if isinstance(data, Event):
            source = data.transaction or data.culprit or "<unknown>"
            group = data.group
            level = data.get_tag("level") or "error"
            custom_details = serialize(data, None, ExternalEventSerializer())
            summary = (data.message or data.title)[:1024]
            payload = {
                "routing_key": self.integration_key,
                "event_action": "trigger",
                "dedup_key": group.qualified_short_id,
                "payload": {
                    "summary": summary,
                    "severity": LEVEL_SEVERITY_MAP[level],
                    "source": source,
                    "component": group.project.slug,
                    "custom_details": custom_details,
                },
                "links": [
                    {
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
