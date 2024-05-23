---
title: Understanding Twilio
---
Twilio is a cloud communications platform that allows users to send and receive text messages globally. In the context of the `demo-sentry` repository, Twilio is used as a plugin to provide SMS notifications for Sentry alerts. The `TwilioPlugin` class in `src/sentry_plugins/twilio/plugin.py` is the main entry point for this functionality. It uses the `TwilioApiClient` class from `src/sentry_plugins/twilio/client.py` to interact with the Twilio API. The `TwilioConfigurationForm` class in `src/sentry_plugins/twilio/plugin.py` is used to handle the configuration settings required for the Twilio service, such as the account SID, auth token, and phone numbers for sending and receiving messages.

<SwmSnippet path="/src/sentry_plugins/twilio/client.py" line="11">

---

# Twilio API Endpoints

The `twilio_messages_endpoint` is a string that defines the endpoint for sending messages via Twilio. It uses the account SID in its path.

```python
    twilio_messages_endpoint = "https://api.twilio.com/2010-04-01/Accounts/{0}/Messages.json"
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/twilio/client.py" line="23">

---

# Request to Twilio API

The `request` method is used to send a POST request to the Twilio API. It formats the endpoint with the account SID, sets the Authorization header using basic auth, and sends the data. Note that the `json` parameter is set to False because Twilio doesn't accept the json headers.

```python
    def request(self, data):
        endpoint = self.twilio_messages_endpoint.format(self.account_sid)
        headers = {"Authorization": self.basic_auth(self.account_sid, self.auth_token)}
        # Twilio doesn't accept the json headers, so set this to False
        # https://www.twilio.com/docs/usage/your-request-to-twilio#post
        return self._request(path=endpoint, method="post", data=data, headers=headers, json=False)
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
