---
title: PagerDuty Integration 101
---
PagerDuty Integration in the Sentry application is a feature that allows Sentry to connect with one or more PagerDuty accounts and trigger incidents from Sentry alerts. This integration adds a new Alert Rule action to all projects. To enable automatic notifications sent to PagerDuty, a rule using the PagerDuty action must be created in the project settings. The integration is designed to manage incidents and outages by sending Sentry notifications to PagerDuty. It also allows configuring rule-based PagerDuty alerts to automatically be triggered in a specific service or in multiple services. The integration is implemented in the `PagerDutyIntegrationProvider` class, which uses the `PagerDutyIntegration` class to manage the integration's functionality.

<SwmSnippet path="/src/sentry/integrations/pagerduty/client.py" line="14">

---

# PagerDutyClient Class

The `PagerDutyClient` class is initialized with an `integration_key` which is used for authenticating requests to the PagerDuty API. The `base_url` is set to the endpoint for sending events to PagerDuty.

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

# send_trigger Method

The `send_trigger` method is used to send trigger events to PagerDuty. It accepts an `Event` object or a payload for a metric alert. The method constructs a payload according to the PagerDuty API specification and sends a POST request to the `/enqueue` endpoint. The payload includes details about the event such as the severity, source, component, and a link to view the issue details in Sentry.

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
