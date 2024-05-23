---
title: Introduction to PagerDuty
---
PagerDuty is an incident management platform that provides reliable incident notifications via email, push, SMS, and phone, as well as automatic escalations, on-call scheduling, and other functionality to help teams detect and fix infrastructure problems quickly. In the context of the `demo-sentry` repository, the `PagerDutyPlugin` class in `src/sentry_plugins/pagerduty/plugin.py` is used to integrate Sentry with PagerDuty. This plugin allows Sentry to send alerts to PagerDuty, which can then manage incidents and outages based on these notifications. The `PagerDutyClient` class in `src/sentry_plugins/pagerduty/client.py` is used to interact with the PagerDuty API, allowing Sentry to trigger incidents in PagerDuty.

<SwmSnippet path="/src/sentry_plugins/pagerduty/plugin.py" line="10">

---

# PagerDutyPlugin Class

The `PagerDutyPlugin` class is responsible for sending alerts to PagerDuty. It has several methods such as `is_configured`, `get_config`, and `notify_users`. The `is_configured` method checks if the plugin is configured for a given project. The `get_config` method retrieves the configuration for the plugin. The `notify_users` method is responsible for sending notifications to PagerDuty. It first checks if the plugin is configured for the project associated with the event. If it is, it prepares the details of the event and uses the `PagerDutyClient` to trigger an incident on PagerDuty.

```python
class PagerDutyPlugin(CorePluginMixin, NotifyPlugin):
    description = "Send alerts to PagerDuty."
    slug = "pagerduty"
    title = "PagerDuty"
    conf_key = slug
    conf_title = title
    required_field = "service_key"
    feature_descriptions = [
        FeatureDescription(
            """
            Manage incidents and outages by sending Sentry notifications to PagerDuty.
            """,
            IntegrationFeatures.INCIDENT_MANAGEMENT,
        ),
        FeatureDescription(
            """
            Configure rule based PagerDuty alerts to automatically be triggered in a specific
            service - or in multiple services!
            """,
            IntegrationFeatures.ALERT_RULE,
        ),
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/pagerduty/client.py" line="8">

---

# PagerDutyClient Class

The `PagerDutyClient` class is responsible for interacting with the PagerDuty API. It has a `request` method that sends a request to the PagerDuty API and a `trigger_incident` method that triggers an incident on PagerDuty. The `trigger_incident` method prepares the payload for the request and calls the `request` method to send the request.

```python
class PagerDutyClient(ApiClient):
    client = "sentry"
    plugin_name = "pagerduty"
    allow_redirects = False

    def __init__(self, service_key=None):
        self.service_key = service_key
        super().__init__()

    def build_url(self, path):
        return INTEGRATION_API_URL

    def request(self, data):
        payload = {"service_key": self.service_key}
        payload.update(data)

        return self._request(path="", method="post", data=payload)

    def trigger_incident(
        self,
        description,
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
