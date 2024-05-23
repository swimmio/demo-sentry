---
title: Overview of MS Teams Integration
---
The MS Teams Integration in the Sentry repository is designed to connect Sentry with Microsoft Teams, a hub for teamwork in Office 365. This integration allows alerts from Sentry to be sent directly to Teams channels, enabling users to assign, ignore, and resolve issues right from the Teams interface. The integration is implemented in the `MsTeamsIntegrationProvider` class, which is part of the `sentry.integrations.msteams` module. This class is responsible for building the integration, which includes fetching the necessary token data and setting up the integration metadata. The integration also includes features like chat interaction and rule-based alerts. Once installed, a confirmation message is sent to the Teams channel.

<SwmSnippet path="/src/sentry/integrations/msteams/webhook.py" line="134">

---

# MS Teams Webhook Endpoint

The `MsTeamsWebhookEndpoint` class defines the endpoint for MS Teams webhooks. It handles POST requests, which are dispatched based on the type of the request. For example, if the request type is 'message', it's handled by the `handle_channel_message` method, and if the type is 'conversationUpdate', it's handled by either `handle_personal_member_add`, `handle_team_member_added`, or `handle_team_member_removed` methods, depending on the conversation type.

```python
class MsTeamsWebhookEndpoint(Endpoint):
    authentication_classes = ()
    permission_classes = ()
    provider = "msteams"

    @csrf_exempt
    def dispatch(self, request: Request, *args, **kwargs) -> Response:
        return super().dispatch(request, *args, **kwargs)

    @transaction_start("MsTeamsWebhookEndpoint")
    def post(self, request: Request) -> Response:
        # verify_signature will raise the exception corresponding to the error
        verify_signature(request)

        data = request.data
        conversation_type = data.get("conversation", {}).get("conversationType")

        # only care about conversationUpdate and message
        if data["type"] == "message":
            # the only message events we care about are those which
            # are from a user submitting an option on a card, which
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/msteams/client.py" line="12">

---

# MS Teams Client

The `MsTeamsAbstractClient` class is an abstract client that doesn't handle setting the base URL or auth token. It defines methods for interacting with the MS Teams API, such as getting team info, getting a list of channels, sending a message, and sending a card. The `MsTeamsPreInstallClient` and `MsTeamsClient` classes extend this abstract client and provide implementations for setting the base URL and handling token refreshing.

```python
class MsTeamsAbstractClient(ApiClient):
    integration_name = "msteams"
    TEAM_URL = "/v3/teams/%s"
    CHANNEL_URL = "/v3/teams/%s/conversations"
    ACTIVITY_URL = "/v3/conversations/%s/activities"
    MESSAGE_URL = "/v3/conversations/%s/activities/%s"
    CONVERSATION_URL = "/v3/conversations"
    MEMBER_URL = "/v3/conversations/%s/pagedmembers"

    def request(self, method, path, data=None, params=None):
        headers = {"Authorization": f"Bearer {self.access_token}"}
        return self._request(method, path, headers=headers, data=data, params=params)

    def get_team_info(self, team_id):
        return self.get(self.TEAM_URL % team_id)

    def get_channel_list(self, team_id):
        resp = self.get(self.CHANNEL_URL % team_id)
        return resp.get("conversations")

    def get_member_list(self, team_id, continuation_token=None):
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
