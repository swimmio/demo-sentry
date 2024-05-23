---
title: Diving into the Structure and Key Components of the Freight Plugin
---
This document will cover the structure of the Freight plugin and its key components. We'll cover:

1. The FreightPlugin class and its properties
2. The FreightReleaseHook class and its usage
3. How the Freight plugin is integrated into the project.

<SwmSnippet path="/src/sentry_plugins/freight/plugin.py" line="29">

---

# The FreightPlugin Class

The `FreightPlugin` class is a key component of the Freight plugin. It inherits from the `ReleaseTrackingPlugin` class and contains properties such as `author`, `author_url`, `title`, `slug`, `description`, and `version`. The `get_release_hook` method returns the `FreightReleaseHook` class.

```python
class FreightPlugin(ReleaseTrackingPlugin):
    author = "Sentry Team"
    author_url = "https://github.com/getsentry"

    title = "Freight"
    slug = "freight"
    description = "Integrate Freight release tracking."
    version = sentry.VERSION

    def has_plugin_conf(self):
        return True

    def get_release_doc_html(self, hook_url):
        return DOC_HTML.format(hook_url=hook_url)

    def get_release_hook(self):
        return FreightReleaseHook
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/freight/plugin.py" line="18">

---

# The FreightReleaseHook Class

The `FreightReleaseHook` class is another key component of the Freight plugin. It inherits from the `ReleaseHook` class and overrides the `handle` method. This method processes the request based on the event type (`started` or `finished`).

```python
class FreightReleaseHook(ReleaseHook):
    def handle(self, request: Request) -> Response:
        data = json.loads(request.body)
        if data["event"] == "started":
            self.start_release(version=data["sha"], ref=data["ref"], url=data["link"])
        elif data["event"] == "finished":
            self.finish_release(version=data["sha"], ref=data["ref"], url=data["link"])
        else:
            raise ValueError(data["event"])
```

---

</SwmSnippet>

<SwmSnippet path="/setup.py" line="138">

---

# Integration of the Freight Plugin

The `FreightPlugin` is integrated into the project in the `setup.py` file. It is registered under the key `freight`.

```python
            "freight = sentry_plugins.freight.plugin:FreightPlugin",
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
