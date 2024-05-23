---
title: Analyzing the Role of the Freight Plugin in Sentrys Main Functionality
---
This document will cover the role and functionality of the Freight plugin in Sentry. We'll cover:

1. What is the Freight plugin
2. How it is integrated into Sentry
3. The main functionality of the Freight plugin.

<SwmSnippet path="/src/sentry_plugins/freight/plugin.py" line="33">

---

# What is the Freight plugin

The Freight plugin is a release tracking plugin for Sentry. It is identified by the slug 'freight' and its main purpose is to integrate Freight release tracking into Sentry.

```python
    title = "Freight"
    slug = "freight"
    description = "Integrate Freight release tracking."
    version = sentry.VERSION
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/runner/commands/plugins.py" line="4">

---

# How it is integrated into Sentry

The Freight plugin is managed as part of Sentry's plugins system. The `plugins` function is used to manage all Sentry plugins.

```python
@click.group()
def plugins():
    "Manage Sentry plugins."
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/freight/plugin.py" line="9">

---

# The main functionality of the Freight plugin

The Freight plugin provides a webhook configuration for Freight notifications. This allows Sentry to receive notifications from Freight about release tracking events.

```python
DOC_HTML = """
<p>Configure a Freight notification with the given webhook url.</p>
<pre class="clippy">{{
    "type": "sentry",
    "config": {{"webhook_url": "{hook_url}"}}
}}</pre>
"""
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
