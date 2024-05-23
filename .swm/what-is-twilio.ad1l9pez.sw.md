---
title: What is Twilio
---
Twilio is a cloud communications platform that allows users to send and receive text messages globally. In the context of the `demo-sentry` repository, Twilio is used as a plugin to provide SMS notifications for Sentry alerts. The `TwilioPlugin` class in `src/sentry_plugins/twilio/plugin.py` is the main entry point for this functionality. It uses the `TwilioApiClient` class from `src/sentry_plugins/twilio/client.py` to interact with the Twilio API. The `TwilioConfigurationForm` class in `src/sentry_plugins/twilio/plugin.py` is used to handle the configuration settings for the Twilio plugin, such as the account SID, auth token, and phone numbers for sending and receiving SMS.

<SwmSnippet path="/src/sentry_plugins/twilio/client.py" line="8">

---

# Twilio API Client

The `TwilioApiClient` class is used to interact with the Twilio API. It inherits from the `ApiClient` class and includes methods for basic authentication (`basic_auth`) and sending requests (`request`). The `twilio_messages_endpoint` attribute is the URL for sending messages via the Twilio API.

```python
class TwilioApiClient(ApiClient):
    plugin_name = "twilio"
    allow_redirects = False
    twilio_messages_endpoint = "https://api.twilio.com/2010-04-01/Accounts/{0}/Messages.json"

    def __init__(self, account_sid, auth_token, sms_from, sms_to):
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.sms_from = sms_from
        self.sms_to = sms_to
        super().__init__()

    def basic_auth(self, user, password):
        return b"Basic " + b64encode(force_bytes(user + ":" + password))

    def request(self, data):
        endpoint = self.twilio_messages_endpoint.format(self.account_sid)
        headers = {"Authorization": self.basic_auth(self.account_sid, self.auth_token)}
        # Twilio doesn't accept the json headers, so set this to False
        # https://www.twilio.com/docs/usage/your-request-to-twilio#post
        return self._request(path=endpoint, method="post", data=data, headers=headers, json=False)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/twilio/client.py" line="11">

---

# Twilio Messages Endpoint

The `twilio_messages_endpoint` is the URL for the Twilio API endpoint that is used to send messages. It is a string that includes a placeholder for the account SID, which is filled in when a request is made.

```python
    twilio_messages_endpoint = "https://api.twilio.com/2010-04-01/Accounts/{0}/Messages.json"
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
