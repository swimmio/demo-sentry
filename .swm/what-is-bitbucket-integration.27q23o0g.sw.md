---
title: What is Bitbucket Integration
---
Bitbucket Integration in the Sentry application is a feature that connects your Sentry organization to Bitbucket. It is implemented in the `BitbucketIntegrationProvider` class in the `src/sentry/integrations/bitbucket/integration.py` file. This integration enables several features such as tracking commits and releases, resolving Sentry issues via Bitbucket commits, and creating Bitbucket issues from Sentry. The integration is defined with a key and name as 'bitbucket', and it uses certain scopes like 'issue:write', 'pullrequest', 'webhook', and 'repository'. The `BitbucketIntegrationProvider` class also defines methods for setting up the integration, building the integration, and handling post-installation tasks. The Bitbucket Integration is used in various parts of the codebase, including the server configuration and the installed module.

<SwmSnippet path="/src/sentry/integrations/bitbucket/client.py" line="14">

---

# Bitbucket API Client

The `BitbucketApiClient` class is the main interface for interacting with the Bitbucket API. It defines methods for making requests to various Bitbucket API endpoints, such as getting, creating, and searching for issues, comments, repositories, and hooks. It also handles the creation and encoding of JWT tokens for authentication with the Bitbucket API.

```python
class BitbucketAPIPath:
    """
    All UUID's must be surrounded by curlybraces.

    repo is the fully qualified slug containing 'username/repo_slug'

    repo_slug - repository slug or UUID
    username - username or UUID
    """

    issue = "/2.0/repositories/{repo}/issues/{issue_id}"
    issues = "/2.0/repositories/{repo}/issues"
    issue_comments = "/2.0/repositories/{repo}/issues/{issue_id}/comments"

    repository = "/2.0/repositories/{repo}"
    repositories = "/2.0/repositories/{username}"
    repository_commits = "/2.0/repositories/{repo}/commits/{revision}"
    repository_diff = "/2.0/repositories/{repo}/diff/{spec}"
    repository_hook = "/2.0/repositories/{repo}/hooks/{uid}"
    repository_hooks = "/2.0/repositories/{repo}/hooks"

```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket/integration.py" line="26">

---

# Bitbucket Integration

The `BitbucketIntegration` class handles the integration of Bitbucket with Sentry. It includes methods for getting the client, getting repositories, searching repositories, and handling repo access. The `BitbucketIntegrationProvider` class is responsible for setting up the integration pipeline, post-installation tasks, and building the integration data.

```python
DESCRIPTION = """
Connect your Sentry organization to Bitbucket, enabling the following features:
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
        Resolve Sentry issues via Bitbucket commits by
        including `Fixes PROJ-ID` in the message
        """,
        IntegrationFeatures.COMMITS,
    ),
    FeatureDescription(
        """
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
