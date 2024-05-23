---
title: Microsoft Teams Integration Flow
---
This document will cover the process of token exchange and message handling in the Microsoft Teams integration. We'll cover:

1. Token exchange process
2. Message posting and handling
3. Action submission handling
4. Card building for groups and actions
5. Integration management

## Where is this flow used?

The flow starts with the function `get_token_data`. It is called from multiple entry points as represented in the following diagram:

```mermaid
graph TD;
subgraph src/sentry/integrations/msteams
  handle:::rootsStyle --> get_preinstall_client
end
subgraph src/sentry/integrations/msteams
  get_preinstall_client --> get_token_data:::mainFlowStyle
end
subgraph src/sentry/integrations/msteams
  build_integration:::rootsStyle --> get_token_data:::mainFlowStyle
end
subgraph src/sentry/integrations/msteams
  access_token:::rootsStyle --> get_token_data:::mainFlowStyle
end

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

## The flow itself

```mermaid
graph TD;
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
subgraph src/sentry/integrations/manager.py
  build_group_actions:::mainFlowStyle --> all
end
subgraph src/sentry/integrations/manager.py
  all:::mainFlowStyle --> get
end
  get:::mainFlowStyle --> ...

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

<SwmSnippet path="/src/sentry/integrations/msteams/client.py" line="118">

---

# Token Exchange Process

The `exchange_token` function is used to exchange the client's credentials for a token. This token is used for authentication in subsequent requests to the Microsoft Teams API.

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

# Message Posting and Handling

The `post` function is responsible for handling incoming messages from Microsoft Teams. It verifies the signature of the request, extracts the data, and then routes the message based on its type and content.

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

# Action Submission Handling

The `handle_action_submitted` function is triggered when a user submits an action on a card. It extracts the necessary data from the request, validates the integration and group, and then updates the state of the issue based on the action submitted.

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

# Card Building for Groups and Actions

The `build_group_card` function is used to construct an Adaptive Card for a group. It includes the group title, description, footer, assignee note, and actions.

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

<SwmSnippet path="/src/sentry/integrations/manager.py" line="16">

---

# Integration Management

The `all` and `get` functions in the `manager.py` file are used to manage the integrations. The `all` function returns all visible integrations, while the `get` function retrieves a specific integration based on its key.

```python
    def all(self):
        for key in self.__values.keys():
            integration = self.get(key)
            if integration.visible:
                yield integration

    def get(self, key, **kwargs):
        try:
            cls = self.__values[key]
        except KeyError:
            raise NotRegistered(key)
        return cls(**kwargs)
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
