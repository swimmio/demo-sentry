---
title: Getting started with Opsgenie
---
Opsgenie is a modern incident management platform that ensures critical incidents are never missed, and actions are taken by the right people in the shortest possible time. In the context of the demo-sentry repo, Opsgenie is integrated as a plugin. The Opsgenie plugin, represented by the `OpsGeniePlugin` class in `src/sentry_plugins/opsgenie/plugin.py`, is used to connect Sentry with Opsgenie. This allows Sentry to send alerts and notifications to Opsgenie when certain conditions are met. The `OpsGenieApiClient` class in `src/sentry_plugins/opsgenie/client.py` is used to interact with the Opsgenie API. The `plugin_name` variable in this class is set to 'opsgenie', indicating the name of the plugin. The `slug` and `conf_key` variables in the `OpsGeniePlugin` class are also set to 'opsgenie', which are used for plugin identification and configuration respectively.

<SwmSnippet path="/src/sentry_plugins/opsgenie/plugin.py" line="22">

---

# Opsgenie Plugin

The `OpsGenieOptionsForm` class defines the form fields for the Opsgenie plugin configuration. It includes the API key, recipients, and alert URL. The alert URL is the endpoint for Opsgenie, which is typically `https://api.opsgenie.com/v2/alerts`.

```python
class OpsGenieOptionsForm(notify.NotificationConfigurationForm):
    api_key = forms.CharField(
        max_length=255,
        help_text="OpsGenie API key used for authenticating API requests",
        required=True,
    )
    recipients = forms.CharField(
        max_length=255,
        help_text="The user names of individual users or groups (comma separated)",
        required=False,
    )
    alert_url = forms.URLField(
        max_length=255,
        label="OpsGenie Alert URL",
        widget=forms.TextInput(
            attrs={"class": "span6", "placeholder": "e.g. https://api.opsgenie.com/v2/alerts"}
        ),
        help_text="It must be visible to the Sentry server",
        required=True,
    )
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/opsgenie/plugin.py" line="97">

---

# Triggering Alerts

The `notify_users` method is used to trigger alerts in Opsgenie. It first checks if the plugin is configured correctly, then it builds the payload for the alert and sends it to Opsgenie using the `trigger_incident` method of the `OpsGenieApiClient`.

```python
    def notify_users(self, group, event, fail_silently=False, triggering_rules=None, **kwargs):
        if not self.is_configured(group.project):
            return

        client = self.get_client(group.project)
        payload = self.build_payload(group, event, triggering_rules)
        try:
            client.trigger_incident(payload)
        except Exception as e:
            raise self.raise_error(e)
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
