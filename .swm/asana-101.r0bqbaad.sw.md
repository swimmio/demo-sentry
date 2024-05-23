---
title: Asana 101
---
Asana is a productivity tool used for task management. In the context of the `demo-sentry` repository, Asana is integrated as a plugin. This plugin allows users to create tasks in Asana directly from Sentry issues and link Sentry issues to existing tasks in Asana. The `AsanaPlugin` class in `src/sentry_plugins/asana/plugin.py` is the main class responsible for this integration. It interacts with the Asana API through the `AsanaClient` class defined in `src/sentry_plugins/asana/client.py`. The plugin requires an Asana identity to be associated with the user's account for it to function, as indicated by the `ERR_AUTH_NOT_CONFIGURED` constant.

<SwmSnippet path="/src/sentry_plugins/asana/client.py" line="4">

---

# AsanaClient Class

The `AsanaClient` class is a client for interacting with the Asana API. It extends the `AuthApiClient` class and sets the `base_url` to Asana's API base URL and `plugin_name` to 'asana'.

```python
class AsanaClient(AuthApiClient):
    base_url = "https://app.asana.com/api/1.0"
    plugin_name = "asana"

```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/asana/client.py" line="8">

---

# Asana API Endpoints

The `AsanaClient` class defines several methods that correspond to different endpoints of the Asana API. For example, `get_workspaces` method corresponds to the '/workspaces' endpoint, `get_issue` method corresponds to the '/tasks/{issue_id}' endpoint, `create_issue` method corresponds to the '/tasks' endpoint, `create_comment` method corresponds to the '/tasks/{issue_id}/stories/' endpoint, and `search` method corresponds to the '/workspaces/{workspace}/typeahead' endpoint.

```python
    def get_workspaces(self):
        return self.get("/workspaces")

    def get_issue(self, issue_id):
        return self.get("/tasks/%s" % issue_id)

    def create_issue(self, workspace, data):
        asana_data = {
            "name": data["title"],
            "notes": data["description"],
            "workspace": str(workspace),
        }
        if data.get("project"):
            asana_data["projects"] = [str(data["project"])]

        if data.get("assignee"):
            asana_data["assignee"] = str(data["assignee"])

        return self.post("/tasks", data={"data": asana_data})

    def create_comment(self, issue_id, data):
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
