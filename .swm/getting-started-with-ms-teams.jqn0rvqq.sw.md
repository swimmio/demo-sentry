---
title: Getting started with MS Teams
---
Microsoft Teams (MS Teams) is a hub for teamwork in Office 365, keeping all your team's chats, meetings, files, and apps together in one place. In the context of the Sentry repository, MS Teams is integrated to provide alerts that let you assign, ignore, and resolve issues right in your Teams channels. This integration is handled by the `MsTeamsIntegrationProvider` class in `src/sentry/integrations/msteams/integration.py`. The integration allows interaction with messages in the chat to assign, ignore, and resolve issues, and also enables the configuration of rule-based Teams alerts to automatically be posted into a specific channel or user. The `MsTeamsClient` class in `src/sentry/integrations/msteams/client.py` is used with an existing integration object and handles token refreshing.

<SwmSnippet path="/src/sentry/integrations/msteams/client.py" line="12">

---

# MS Teams API Client

The `MsTeamsAbstractClient` class in the `client.py` file defines the base API client for MS Teams. It includes the base URLs for various endpoints such as `TEAM_URL`, `CHANNEL_URL`, `ACTIVITY_URL`, `MESSAGE_URL`, `CONVERSATION_URL`, and `MEMBER_URL`. The class also defines methods for making requests to these endpoints, such as `get_team_info`, `get_channel_list`, `get_member_list`, `get_user_conversation_id`, `send_message`, `update_message`, `send_card`, and `update_card`. These methods are used to interact with the MS Teams API, for example, to get information about a team or channel, send or update a message, or send or update a card.

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

<SwmSnippet path="/src/sentry/integrations/msteams/webhook.py" line="134">

---

# MS Teams Webhook Endpoint

The `MsTeamsWebhookEndpoint` class in the `webhook.py` file handles incoming webhooks from MS Teams. It includes methods for handling different types of events, such as `handle_personal_member_add`, `handle_team_member_added`, `handle_team_member_removed`, `handle_action_submitted`, `handle_channel_message`, and `handle_personal_message`. These methods are triggered when the corresponding event occurs in MS Teams, for example, when a member is added to a team or a message is sent in a channel.

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

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
