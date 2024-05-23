---
title: Features of the Bitbucket Server Integration
---
This document will cover the Bitbucket Server integration within the Sentry repository. We'll cover:

1. The features provided by the Bitbucket Server integration
2. The Bitbucket Server Integration class
3. The Bitbucket Server Integration Provider class.

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/integration.py" line="35">

---

# Features of Bitbucket Server Integration

The Bitbucket Server integration provides two main features. The first feature allows tracking of commits and releases. The second feature enables resolving Sentry issues via Bitbucket Server commits by including `Fixes PROJ-ID` in the commit message.

```python
"""

FEATURES = [
    FeatureDescription(
        """
        Track commits and releases (learn more
        [here](https://docs.sentry.io/learn/releases/))
        """,
        IntegrationFeatures.COMMITS,
    ),
    FeatureDescription(
        """
        Resolve Sentry issues via Bitbucket Server commits by
        including `Fixes PROJ-ID` in the message
        """,
        IntegrationFeatures.COMMITS,
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/integration.py" line="221">

---

# Bitbucket Server Integration Class

The `BitbucketServerIntegration` class is an implementation of `IntegrationInstallation` for Bitbucket Server. It provides methods for getting client details, checking repository access, and getting repositories. It also handles errors and manages repository access based on the REPO_ADMIN permission.

```python
class BitbucketServerIntegration(IntegrationInstallation, RepositoryMixin):
    """
    IntegrationInstallation implementation for Bitbucket Server
    """

    repo_search = True

    default_identity = None

    def get_client(self):
        if self.default_identity is None:
            try:
                self.default_identity = self.get_default_identity()
            except Identity.DoesNotExist:
                raise IntegrationError("Identity not found.")

        return BitbucketServer(
            self.model.metadata["base_url"],
            self.default_identity.data,
            self.model.metadata["verify_ssl"],
        )
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/integration.py" line="297">

---

# Bitbucket Server Integration Provider Class

The `BitbucketServerIntegrationProvider` class is an implementation of `IntegrationProvider`. It specifies the key, name, metadata, and integration class for Bitbucket Server. It also indicates that a default identity is needed and that the integration can be added.

```python
class BitbucketServerIntegrationProvider(IntegrationProvider):
    key = "bitbucket_server"
    name = "Bitbucket Server"
    metadata = metadata
    integration_cls = BitbucketServerIntegration
    needs_default_identity = True
    can_add = True
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
