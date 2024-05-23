---
title: Segment 101
---
Segment, as used in the `src/sentry_plugins/segment` directory, refers to a customer data platform (CDP) that helps collect, clean, and control customer data. In the context of this repository, Segment is integrated as a plugin, specifically the `SegmentPlugin` class. This plugin allows Sentry events to be forwarded to Segment, enabling the collection of client-side data for Sentry automatically without the need to install the Sentry client library. The plugin is configured with a Segment write key and forwards Sentry errors and events to Segment. It also prepares event payloads with specific properties and context, such as event ID, transaction, release, environment, and user details.

<SwmSnippet path="/src/sentry_plugins/segment/plugin.py" line="17">

---

# SegmentPlugin Class

The `SegmentPlugin` class is a core plugin for Sentry that forwards data to Segment. It defines the Segment API endpoint and the required fields for the plugin configuration. It also describes the features of the plugin, such as forwarding Sentry errors and events to Segment.

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

<SwmSnippet path="/src/sentry_plugins/segment/plugin.py" line="44">

---

# Event Handling and Data Forwarding

The `SegmentPlugin` class defines several methods for event handling and data forwarding. The `get_event_props` method is used to get the properties of an event. The `get_event_payload` method is used to get the payload of an event, which includes context and properties. The `forward_event` method is used to forward an event to the Segment API endpoint. It checks if the event is an error and if a user is present, then it sends a POST request to the Segment API endpoint with the event payload.

```python
    def get_rate_limit(self):
        # number of requests, number of seconds (window)
        return (50, 1)

    def get_event_props(self, event):
        props = {
            "eventId": event.event_id,
            "transaction": event.get_tag("transaction") or "",
            "release": event.get_tag("sentry:release") or "",
            "environment": event.get_tag("environment") or "",
        }
        if "sentry.interfaces.Http" in event.interfaces:
            http = event.interfaces["sentry.interfaces.Http"]
            headers = http.headers
            if not isinstance(headers, dict):
                headers = dict(headers or ())

            props.update(
                {
                    "requestUrl": http.url,
                    "requestMethod": http.method,
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
