---
title: 'Understanding Sentrys Bug Tracking Mechanism: An In-depth Perspective'
---
This document will cover the unique bug tracking mechanism of Sentry. We'll cover:

1. How Sentry uses the `issue_tracker_used` signal
2. The role of the `ExampleIssueTrackingPlugin` class

<SwmSnippet path="/src/sentry/receivers/onboarding.py" line="24">

---

# How Sentry uses the `issue_tracker_used` signal

The `issue_tracker_used` signal is used in various parts of the Sentry codebase. This signal is likely triggered when an issue tracker is used, allowing other parts of the application to react to this event.

```python
    issue_tracker_used,
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
