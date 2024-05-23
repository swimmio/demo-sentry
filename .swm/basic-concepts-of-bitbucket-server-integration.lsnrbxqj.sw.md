---
title: Basic concepts of Bitbucket Server Integration
---
Bitbucket Server Integration in the Sentry application is a feature that allows Sentry to connect with Bitbucket Server. This integration enables tracking of commits and releases, and resolving Sentry issues via Bitbucket Server commits. The Bitbucket Server Integration is implemented in the `BitbucketServerIntegrationProvider` class, which is a subclass of `IntegrationProvider`. This class defines the key, name, and metadata for the integration, and also specifies the integration class as `BitbucketServerIntegration`. The `BitbucketServerIntegration` class, in turn, implements the functionality for the integration, such as getting the client, searching repositories, and checking repository access. It's important to note that the Bitbucket Server instance must be able to communicate with Sentry for this integration to work properly.

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/client.py" line="13">

---

# Bitbucket Server API Paths

The `BitbucketServerAPIPath` class defines the API paths for various operations. For example, `repository` is the API path to fetch a specific repository, `repositories` fetches all repositories, `repository_hook` fetches a specific webhook, `repository_hooks` fetches all webhooks, and `repository_commits` fetches all commits of a repository.

```python
class BitbucketServerAPIPath:
    """
    project is the short key of the project
    repo is the fully qualified slug
    """

    repository = "/rest/api/1.0/projects/{project}/repos/{repo}"
    repositories = "/rest/api/1.0/repos"
    repository_hook = "/rest/api/1.0/projects/{project}/repos/{repo}/webhooks/{id}"
    repository_hooks = "/rest/api/1.0/projects/{project}/repos/{repo}/webhooks"
    repository_commits = "/rest/api/1.0/projects/{project}/repos/{repo}/commits"
    commit_changes = "/rest/api/1.0/projects/{project}/repos/{repo}/commits/{commit}/changes"
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/client.py" line="93">

---

# Bitbucket Server Client

The `BitbucketServer` class is the main client for interacting with Bitbucket Server. It uses the API paths defined in `BitbucketServerAPIPath` to make requests. For example, `get_repos` method fetches all repositories, `create_hook` creates a new webhook, `delete_hook` deletes a specific webhook, `get_commits` fetches all commits between two hashes, and `get_last_commits` fetches the last few commits of a repository.

```python
class BitbucketServer(ApiClient):
    """
    Contains the BitBucket Server specifics in order to communicate with bitbucket

    You can find BitBucket REST API docs here:

    https://developer.atlassian.com/server/bitbucket/reference/rest-api/
    """

    integration_name = "bitbucket_server"

    def __init__(self, base_url, credentials, verify_ssl):
        super().__init__(verify_ssl)

        self.base_url = base_url
        self.credentials = credentials

    def get_repos(self):
        return self.get(
            BitbucketServerAPIPath.repositories,
            auth=self.get_auth(),
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
