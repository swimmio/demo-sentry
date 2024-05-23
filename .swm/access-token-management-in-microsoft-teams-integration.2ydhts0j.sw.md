---
title: Access Token Management in Microsoft Teams Integration
---
This document will cover the process of generating and managing access tokens in the Microsoft Teams integration. The process includes:

1. Generating the access token
2. Exchanging the token
3. Posting the token
4. Handling the action submitted
5. Building the group card
6. Building the group actions
7. Generating the action payload.

```mermaid
graph TD;
subgraph src/sentry/integrations/msteams
  access_token:::mainFlowStyle --> get_token_data
end
subgraph src/sentry/integrations/msteams
  get_token_data:::mainFlowStyle --> exchange_token
end
subgraph src/sentry/integrations/msteams
  exchange_token:::mainFlowStyle --> post
end
subgraph src/sentry/integrations/msteams
  post:::mainFlowStyle --> handle_action_submitted
end
subgraph src/sentry/integrations/msteams
  handle_action_submitted:::mainFlowStyle --> build_group_card
end
subgraph src/sentry/integrations/msteams
  build_group_card:::mainFlowStyle --> build_group_actions
end
subgraph src/sentry/integrations/msteams
  build_group_actions:::mainFlowStyle --> generate_action_payload
end
  generate_action_payload:::mainFlowStyle --> ...

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

<SwmSnippet path="/src/sentry/integrations/msteams/client.py" line="129">

---

# Generating the access token

The function `get_token_data` is used to generate the access token. It uses the client ID and secret to create an OAuth client and exchange the token. The expiration date of the token is calculated and the token data is returned.

```python
def get_token_data():
    client_id = options.get("msteams.client-id")
    client_secret = options.get("msteams.client-secret")
    client = OAuthMsTeamsClient(client_id, client_secret)
    resp = client.exchange_token()
    # calculate the expiration date but offset because of the delay in receiving the response
    expires_at = int(time.time()) + int(resp["expires_in"]) - CLOCK_SKEW
    return {"access_token": resp["access_token"], "expires_at": expires_at}
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/msteams/client.py" line="118">

---

# Exchanging the token

The function `exchange_token` is used to exchange the token. It sets up the necessary headers and data, and then makes a POST request to the token URL.

```python
    def exchange_token(self):
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "client_credentials",
            "scope": "https://api.botframework.com/.default",
        }
        return self.post(self.TOKEN_URL, data=urlencode(data), headers=headers, json=False)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/msteams/webhook.py" line="144">

---

# Posting the token

The function `post` is used to post the token. It verifies the signature of the request, extracts the data, and handles the message or conversation update accordingly.

```python
    def post(self, request: Request) -> Response:
        # verify_signature will raise the exception corresponding to the error
        verify_signature(request)

        data = request.data
        conversation_type = data.get("conversation", {}).get("conversationType")

        # only care about conversationUpdate and message
        if data["type"] == "message":
            # the only message events we care about are those which
            # are from a user submitting an option on a card, which
            # will always contain an "payload.actionType" in the data.
            if data.get("value", {}).get("payload", {}).get("actionType"):
                return self.handle_action_submitted(request)
            elif conversation_type == "channel":
                return self.handle_channel_message(request)
            else:
                return self.handle_personal_message(request)
        elif data["type"] == "conversationUpdate":
            channel_data = data["channelData"]
            event = channel_data.get("eventType")
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/msteams/webhook.py" line="322">

---

# Handling the action submitted

The function `handle_action_submitted` is used to handle the action submitted. It extracts the necessary parameters, validates the integration and group, and updates the state of the issue.

```python
    def handle_action_submitted(self, request: Request):
        # pull out parameters
        data = request.data
        channel_data = data["channelData"]
        tenant_id = channel_data["tenant"]["id"]
        payload = data["value"]["payload"]
        group_id = payload["groupId"]
        integration_id = payload["integrationId"]
        user_id = data["from"]["id"]
        activity_id = data["replyToId"]
        conversation = data["conversation"]
        if conversation["conversationType"] == "personal":
            conversation_id = conversation["id"]
        else:
            conversation_id = channel_data["channel"]["id"]

        try:
            integration = Integration.objects.get(id=integration_id)
        except Integration.DoesNotExist:
            logger.info(
                "msteams.action.missing-integration", extra={"integration_id": integration_id}
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/msteams/card_builder.py" line="591">

---

# Building the group card

The function `build_group_card` is used to build the group card. It constructs the title, description, footer, assignee note, and actions of the card.

```python
def build_group_card(group, event, rules, integration):
    project = Project.objects.get_from_cache(id=group.project_id)

    title = build_group_title(group)
    body = [title]

    desc = build_group_descr(group)
    if desc:
        body.append(desc)

    footer = build_group_footer(group, rules, project, event)
    body.append(footer)

    assignee_note = build_assignee_note(group)
    if assignee_note:
        body.append(assignee_note)

    actions = build_group_actions(group, event, rules, integration)
    body.append(actions)

    return {
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/msteams/card_builder.py" line="409">

---

# Building the group actions

The function `build_group_actions` is used to build the group actions. It sets up the resolve, ignore, and assign actions based on the group status.

```python
def build_group_actions(group, event, rules, integration):
    status = group.get_status()

    if status == GroupStatus.RESOLVED:
        resolve_action = {
            "type": "Action.Submit",
            "title": "Unresolve",
            "data": generate_action_payload(ACTION_TYPE.UNRESOLVE, event, rules, integration),
        }
    else:
        resolve_action = {
            "type": "Action.ShowCard",
            "version": "1.2",
            "title": "Resolve",
            "card": {
                "type": "AdaptiveCard",
                "body": [
                    {"type": "TextBlock", "text": "Resolve", "weight": "Bolder"},
                    {
                        "type": "Input.ChoiceSet",
                        "id": "resolveInput",
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/msteams/card_builder.py" line="19">

---

# Generating the action payload

The function `generate_action_payload` is used to generate the action payload. It includes the action type, group ID, event ID, rule IDs, and integration ID.

```python
def generate_action_payload(action_type, event, rules, integration):
    rule_ids = map(lambda x: x.id, rules)
    # we need nested data or else Teams won't handle the payload correctly
    return {
        "payload": {
            "actionType": action_type,
            "groupId": event.group.id,
            "eventId": event.event_id,
            "rules": rule_ids,
            "integrationId": integration.id,
        }
    }
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
