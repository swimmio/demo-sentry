---
title: Getting started with OpsGenie
---
OpsGenie is a cloud-based service for dev & ops teams, providing reliable alerts, on-call schedule management, and escalations. It integrates with monitoring tools & services, ensuring the right people are notified. In the context of the `demo-sentry` repository, OpsGenie is used as a plugin to trigger alerts from Sentry. The `OpsGeniePlugin` class in `src/sentry_plugins/opsgenie/plugin.py` is responsible for this integration. It uses the `OpsGenieApiClient` class to make API requests to OpsGenie. The plugin is configured with an API key and alert URL, which are used to authenticate requests and direct them to the correct endpoint. The plugin can be used to manage incidents and outages by sending Sentry notifications to OpsGenie, and to configure Sentry rules to trigger notifications based on conditions set by the user.

<SwmSnippet path="/src/sentry_plugins/opsgenie/plugin.py" line="22">

---

# OpsGenie Plugin Configuration

The `OpsGenieOptionsForm` class defines the configuration options for the OpsGenie plugin. It includes the API key, recipients, and alert URL. The API key is used for authenticating API requests, recipients are the usernames of individual users or groups who will receive the alerts, and the alert URL is the endpoint where the alerts are sent.

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

# OpsGenie Alert Triggering

The `notify_users` method in the `OpsGeniePlugin` class is responsible for triggering alerts. It first checks if the plugin is configured correctly, then it builds the payload for the alert using the `build_payload` method and sends it to the OpsGenie API using the `trigger_incident` method of the `OpsGenieApiClient`.

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
