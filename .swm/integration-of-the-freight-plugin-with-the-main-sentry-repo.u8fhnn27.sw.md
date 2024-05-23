---
title: Integration of the Freight Plugin with the Main Sentry Repo
---
This document will cover the integration of the Freight plugin with the main Sentry repo. We'll cover:

1. The Freight plugin's structure and functionality
2. How the Freight plugin interacts with the main Sentry repo.

<SwmSnippet path="/src/sentry_plugins/freight/plugin.py" line="29">

---

# Freight Plugin Structure and Functionality

The `FreightPlugin` class is the main component of the Freight plugin. It contains metadata about the plugin such as the author, title, slug, and version. The `slug` is particularly important as it is used to identify the plugin within the Sentry system.

```python
class FreightPlugin(ReleaseTrackingPlugin):
    author = "Sentry Team"
    author_url = "https://github.com/getsentry"

    title = "Freight"
    slug = "freight"
    description = "Integrate Freight release tracking."
    version = sentry.VERSION
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/api/serializers/models/plugin.py" line="3">

---

# Interaction with the Main Sentry Repo

The `features` module from the main Sentry repo is imported in the `plugin.py` file. This module is used to enable or disable certain features of the Freight plugin based on the configuration of the Sentry system.

```python
from django.utils.text import slugify

from sentry import features
from sentry.api.serializers import Serializer
from sentry.models import ProjectOption
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
