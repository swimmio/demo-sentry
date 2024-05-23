---
title: Segment 101
---
Segment, as implemented in the `src/sentry_plugins/segment` directory, is a customer data platform (CDP) that helps collect, clean, and control customer data. In the context of Sentry, the Segment integration allows Sentry events to be sent to Segment. This means that all client-side data for Sentry can be collected automatically without the need to install the Sentry client library. The `SegmentPlugin` class in `plugin.py` is responsible for this integration. It forwards Sentry errors and events to Segment, and it also configures the Segment settings to asynchronously load Raven.js onto the page without touching the application code. The plugin uses a write key for authentication and communicates with the Segment API endpoint `https://api.segment.io/v1/track`.

<SwmSnippet path="/src/sentry_plugins/segment/plugin.py" line="17">

---

# SegmentPlugin Class

The `SegmentPlugin` class is a core part of the Segment integration. It defines the endpoint for the Segment API (`https://api.segment.io/v1/track`), and includes a feature description that explains the purpose of the class - to forward Sentry errors and events to Segment.

```python
class SegmentPlugin(CorePluginMixin, DataForwardingPlugin):
    title = "Segment"
    slug = "segment"
    description = DESCRIPTION
    conf_key = "segment"
    required_field = "write_key"

    endpoint = "https://api.segment.io/v1/track"
    feature_descriptions = [
        FeatureDescription(
            """
            Forward Sentry errors and events to Segment.
            """,
            IntegrationFeatures.DATA_FORWARDING,
        )
    ]
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/segment/plugin.py" line="123">

---

# Event Forwarding

The `forward_event` method is responsible for sending the event data to the Segment API. It first checks if the event type is 'error' and if a user is associated with the event. If these conditions are met, it retrieves the 'write_key' from the project's options, which is required for authentication with the Segment API. Then, it sends a POST request to the Segment API endpoint with the event payload and the 'write_key' as the authentication.

```python
    def forward_event(self, event, payload, **kwargs):
        # TODO(dcramer): we currently only support authenticated events, as the
        # value of anonymous errors/crashes/etc is much less meaningful in the
        # context of Segment

        # we currently only support errors
        if event.get_event_type() != "error":
            return

        # we avoid instantiating interfaces here as they're only going to be
        # used if there's a User present
        user_interface = event.data.get("sentry.interfaces.User")
        if not user_interface:
            return

        user_id = user_interface.get("id")

        if not user_id:
            return

        write_key = self.get_option("write_key", event.project)
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
