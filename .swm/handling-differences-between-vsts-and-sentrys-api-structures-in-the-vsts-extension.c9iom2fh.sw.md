---
title: >-
  Handling Differences between VSTS and Sentrys API Structures in the VSTS
  Extension
---
This document will cover how the VSTS Extension in the demo-sentry repository deals with the differences between VSTS and Sentry's API structures. We'll cover:

1. The structure of the VSTS integration in the Sentry codebase
2. How the VSTS integration interacts with the Sentry API
3. How the VSTS integration interacts with the VSTS API

<SwmSnippet path="/src/sentry/integrations/vsts/integration.py" line="51">

---

# Structure of the VSTS integration

The VSTS integration is defined in this file. It includes metadata about the integration, such as its description and features, and also sets up logging for the integration.

```python
DESCRIPTION = """
Connect your Sentry organization to one or more of your Azure DevOps
organizations. Get started streamlining your bug squashing workflow by unifying
your Sentry and Azure DevOps organization together.
"""

FEATURES = [
    FeatureDescription(
        """
        Authorize repositories to be added to your Sentry organization to augment
        sentry issues with commit data with [deployment
        tracking](https://docs.sentry.io/learn/releases/).
        """,
        IntegrationFeatures.COMMITS,
    ),
    FeatureDescription(
        """
        Create and link Sentry issue groups directly to a Azure DevOps work item in any of
        your projects, providing a quick way to jump from Sentry bug to tracked
        work item!
        """,
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/api/endpoints/integrations/sentry_apps/interaction.py" line="11">

---

# Interaction with the Sentry API

This file shows how the VSTS integration interacts with the Sentry API. It logs interactions and updates the TSDB models accordingly.

```python
logger = logging.getLogger(__name__)

TSDB_MODELS = [tsdb.models.sentry_app_viewed, tsdb.models.sentry_app_component_interacted]
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/vsts/client.py" line="1">

---

# Interaction with the VSTS API

This file would contain the code for how the VSTS integration interacts with the VSTS API. The specific lines of code are not provided in the context, but this is where you would find the relevant code.

```python
from typing import TYPE_CHECKING, Any, List, Mapping, Optional, Sequence, Union

from rest_framework.response import Response

from sentry.integrations.client import ApiClient, OAuth2RefreshMixin
from sentry.utils.http import absolute_uri

if TYPE_CHECKING:
    from sentry.models import Identity, Project

UNSET = object()

UnsettableString = Union[str, object, None]

FIELD_MAP = {
    "title": "/fields/System.Title",
    "description": "/fields/System.Description",
    "comment": "/fields/System.History",
    "link": "/relations/-",
    "assigned_to": "/fields/System.AssignedTo",
    "state": "/fields/System.State",
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
