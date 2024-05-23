---
title: Introduction to PagerDuty Integration
---
The PagerDuty Integration in the Sentry application is a feature that connects your Sentry organization with one or more PagerDuty accounts, triggering incidents from Sentry alerts. This integration allows for the management of incidents and outages by sending Sentry notifications to PagerDuty. It also enables the configuration of rule-based PagerDuty alerts to be automatically triggered in a specific service or multiple services. The integration adds a new Alert Rule action to all projects, and to enable automatic notifications sent to PagerDuty, a rule using the PagerDuty action must be created in your project settings. The integration is implemented in the `PagerDutyIntegrationProvider` class, which is part of the Sentry's integration providers.

<SwmSnippet path="/src/sentry/integrations/pagerduty/client.py" line="14">

---

# PagerDuty Integration Endpoints

The `PagerDutyClient` class in this file is responsible for interacting with the PagerDuty API. It defines several methods that correspond to different endpoints of the PagerDuty API. The `base_url` attribute points to the base URL of the PagerDuty API. The `send_trigger` method is used to send a trigger event to PagerDuty. The `send_acknowledge` and `send_resolve` methods are placeholders for acknowledging and resolving events, respectively.

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

<SwmSnippet path="/src/sentry/integrations/pagerduty/client.py" line="29">

---

# Sending a Trigger Event

The `send_trigger` method is used to send a trigger event to PagerDuty. It takes an `Event` object as input and constructs a payload based on the event data. This payload is then sent to the PagerDuty API. The method also handles the case where the input data is for a metric alert, in which case the input data is used directly as the payload.

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
