---
title: Getting started with Trello
---
Trello is a popular project management tool that is integrated into the Sentry application through the `TrelloPlugin` class in the `src/sentry_plugins/trello/plugin.py` file. This plugin allows users to create and link Sentry issue groups directly to a Trello card in any of their projects, providing a quick way to jump from a Sentry bug to a tracked ticket. The `TrelloApiClient` class in the `src/sentry_plugins/trello/client.py` file is used to interact with the Trello API. It includes methods for creating a new card, getting lists of a board, and getting organization options among others. The `TrelloPlugin` class uses this client to perform operations like creating a new card in Trello when an issue is created in Sentry.

<SwmSnippet path="/src/sentry_plugins/trello/client.py" line="3">

---

# Trello API Endpoints

The Trello API endpoints are defined as constants at the top of the file. These include paths for getting organization boards, member organizations, lists of a board, creating a new card, getting a single card, adding a comment to a card, getting member boards, and searching.

```python
ORG_BOARD_PATH = "/organizations/%s/boards"
MEMBER_ORG_PATH = "/members/me/organizations"
LISTS_OF_BOARD_PATH = "/boards/%s/lists"
NEW_CARD_PATH = "/cards"
SINGLE_CARD_PATH = "/cards/%s"
ADD_COMMENT_PATH = "/cards/%s/actions/comments"
MEMBER_BOARD_PATH = "/members/me/boards"
SEARCH_PATH = "/search"
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/trello/client.py" line="15">

---

# TrelloApiClient Class

The `TrelloApiClient` class is used to interact with the Trello API. It includes methods for making requests to the API (`request`), getting organization boards (`get_organization_boards`), getting member boards (`get_member_boards`), getting boards (`get_boards`), getting organization list (`get_organization_list`), getting lists of a board (`get_lists_of_board`), creating a new card (`new_card`), getting organization options (`get_organization_options`), getting cards (`get_cards`), getting a single card (`get_card`), and creating a comment on a card (`create_comment`).

```python
class TrelloApiClient(ApiClient):
    base_url = "https://api.trello.com/1"
    plugin_name = "trello"

    def __init__(self, api_key, token=None, **kwargs):
        self.api_key = api_key
        self.token = token
        super().__init__(**kwargs)

    def request(self, method="GET", path="", data=None, params=None, **kwargs):
        params = {} if params is None else params.copy()
        params["token"] = self.token
        params["key"] = self.api_key
        return self._request(method, path, data=data, params=params, **kwargs)

    def get_organization_boards(self, org_id_or_name, fields=None):
        """
        Return boards for an organization/team
        """
        return self.request(path=ORG_BOARD_PATH % (org_id_or_name), params={"fields": fields})

```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
