---
title: Understanding Splunk
---
Splunk is a software platform that provides real-time data processing capabilities and data visualization. In the context of the `demo-sentry` repository, Splunk is integrated as a plugin. The `SplunkPlugin` class in `src/sentry_plugins/splunk/plugin.py` is the main entry point for this integration. It is responsible for forwarding Sentry events to a Splunk instance. The `SplunkApiClient` class in `src/sentry_plugins/splunk/client.py` is used to interact with the Splunk instance via HTTP requests. The plugin is configured with details such as the Splunk instance URL, index, source, and a token for authentication.

# Splunk Endpoints

The instructions file provides details on how to set up the HTTP Event Collector (HEC) endpoint in a Splunk instance. The HEC endpoint is used to send data from Sentry to Splunk. The endpoint URL is typically in the format `https://input-[splunk-instance].cloud.splunk.com:8088`.

<SwmSnippet path="/src/sentry_plugins/splunk/plugin.py" line="26">

---

# Splunk Plugin

The plugin file defines the `SplunkPlugin` class, which is used to forward Sentry events to Splunk. The plugin uses the HEC endpoint to send POST requests to Splunk. The HEC token, which is obtained during the setup process, is used for authentication.

```python
class SplunkPlugin(CorePluginMixin, DataForwardingPlugin):
    """
    - Turn on HTTP Event Collector by enabling its endpoint. HEC is not enabled by default.
      - http://dev.splunk.com/view/event-collector/SP-CAAAE7F
      - Settings > Data Inputs > HTTP Event Collector > Add new
        - Name: Sentry
      - You'll be given an HEC token, which is needed to configure Sentry.
    - On the client that will log to HEC, create a POST request, and set its
      authentication header or key/value pair to include the HEC token.
    - POST data to the HEC token receiver.

    Note: Managed Splunk Cloud customers can turn on HTTP Event Collector by filing a request ticket with Splunk Support.
    Note: Managed Splunk Cloud customers can create a HEC token by filing a request ticket with Splunk Support.

    For more details on the payload: http://dev.splunk.com/view/event-collector/SP-CAAAE6M
    """
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/splunk/client.py" line="1">

---

# Splunk API Client

The client file defines the `SplunkApiClient` class, which is used to make requests to the Splunk API. The `request` method is used to send data to the HEC endpoint. The HEC token is included in the `Authorization` header of the request.

```python
from sentry_plugins.client import ApiClient


class SplunkApiClient(ApiClient):
    plugin_name = "splunk"
    allow_redirects = False
    datadog_prefix = "integrations.splunk"

    def __init__(self, endpoint, token):
        self.endpoint = endpoint
        self.token = token
        super().__init__(verify_ssl=False)

    def request(self, data):
        headers = {"Authorization": f"Splunk {self.token}"}
        return self._request(
            path=self.endpoint,
            method="post",
            data=data,
            headers=headers,
            json=True,
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
