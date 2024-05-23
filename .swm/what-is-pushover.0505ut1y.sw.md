---
title: What is Pushover
---
Pushover is an integration used in the Sentry application to provide real-time notifications on various devices. It is implemented in the `PushoverPlugin` class in the `src/sentry_plugins/pushover/plugin.py` file. The plugin uses the `PushoverClient` class to send messages via the Pushover API. The plugin is configured with a user key and an API key, which are used to authenticate requests to the Pushover API. The plugin can be configured to send notifications with different priorities, and it can also be set to retry sending notifications if the initial attempt fails. The Pushover integration makes it easy for users to receive Sentry alerts on their Android, iPhone, iPad, and Desktop devices.

<SwmSnippet path="/src/sentry_plugins/pushover/client.py" line="4">

---

# PushoverClient Class

The `PushoverClient` class is a subclass of `ApiClient`. It is initialized with a `userkey` and `apikey`, which are used for authentication with the Pushover API. The `base_url` is set to the base URL of the Pushover API.

```python
class PushoverClient(ApiClient):
    base_url = "https://api.pushover.net/1"
    allow_redirects = False
    plugin_name = "pushover"

    def __init__(self, userkey=None, apikey=None):
        self.userkey = userkey
        self.apikey = apikey
        super().__init__()

    def request(self, method, path, data):
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/pushover/client.py" line="22">

---

# Sending Messages with Pushover

The `send_message` method is used to send a message via the Pushover API. It makes a POST request to the `/messages.json` endpoint of the Pushover API. The data for the message is passed as a parameter to this method.

```python
    def send_message(self, data):
        return self.request("POST", "/messages.json", data)
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
