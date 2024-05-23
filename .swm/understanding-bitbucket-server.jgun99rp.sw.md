---
title: Understanding Bitbucket Server
---
Bitbucket Server is a version control system that allows teams to collaborate on code. In the context of the `demo-sentry` repository, Bitbucket Server is integrated to enable certain features. These features include tracking commits and releases, and resolving Sentry issues via Bitbucket Server commits. The Bitbucket Server integration is implemented in the `src/sentry/integrations/bitbucket_server` directory. The `BitbucketServerIntegrationProvider` class in `integration.py` sets up the integration, while the `BitbucketServer` class in `client.py` handles the communication with the Bitbucket Server API. The `BitbucketServerAPIPath` class defines the API endpoints. The integration requires the Bitbucket Server instance to be able to communicate with Sentry.

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/client.py" line="19">

---

# Bitbucket Server API Endpoints

The `BitbucketServerAPIPath` class defines several endpoints for interacting with Bitbucket Server. These include endpoints for fetching repository information (`repository`), listing all repositories (`repositories`), managing repository webhooks (`repository_hook` and `repository_hooks`), and fetching repository commits (`repository_commits`). The `commit_changes` endpoint is used to fetch changes for a specific commit.

```python
    repository = "/rest/api/1.0/projects/{project}/repos/{repo}"
    repositories = "/rest/api/1.0/repos"
    repository_hook = "/rest/api/1.0/projects/{project}/repos/{repo}/webhooks/{id}"
    repository_hooks = "/rest/api/1.0/projects/{project}/repos/{repo}/webhooks"
    repository_commits = "/rest/api/1.0/projects/{project}/repos/{repo}/commits"
    commit_changes = "/rest/api/1.0/projects/{project}/repos/{repo}/commits/{commit}/changes"
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/client.py" line="32">

---

# Bitbucket Server OAuth Flow

The `BitbucketServerSetupClient` class defines methods for the OAuth flow with Bitbucket Server. The `get_request_token`, `get_authorize_url`, and `get_access_token` methods correspond to the three steps of the OAuth flow. The `request_token_url`, `access_token_url`, and `authorize_url` are the endpoints used in this process.

```python
    request_token_url = "{}/plugins/servlet/oauth/request-token"
    access_token_url = "{}/plugins/servlet/oauth/access-token"
    authorize_url = "{}/plugins/servlet/oauth/authorize?oauth_token={}"
    integration_name = "bitbucket_server_setup"

    def __init__(self, base_url, consumer_key, private_key, verify_ssl=True):
        self.base_url = base_url
        self.consumer_key = consumer_key
        self.private_key = private_key
        self.verify_ssl = verify_ssl

    def get_request_token(self):
        """
        Step 1 of the oauth flow.
        Get a request token that we can have the user verify.
        """
        url = self.request_token_url.format(self.base_url)
        resp = self.post(url, allow_text=True)
        return dict(parse_qsl(resp.text))

    def get_authorize_url(self, request_token):
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/client.py" line="93">

---

# Bitbucket Server API Client

The `BitbucketServer` class is the main client for interacting with the Bitbucket Server API. It uses the endpoints defined in `BitbucketServerAPIPath` to perform various operations such as fetching repositories (`get_repos`), searching repositories (`search_repositories`), managing repository webhooks (`create_hook`, `delete_hook`), and fetching commits (`get_commits`, `get_last_commits`, `get_commit_filechanges`).

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
