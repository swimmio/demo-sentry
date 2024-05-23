---
title: What is Bitbucket
---
Bitbucket is a web-based version control repository hosting service owned by Atlassian, for source code and development projects that use either Mercurial or Git revision control systems. In the context of the `demo-sentry` repository, Bitbucket is integrated through the Bitbucket plugin. This plugin allows Sentry to integrate Bitbucket issues by linking a repository to a project. The Bitbucket client communicates with the Bitbucket API, which is hosted at `https://api.bitbucket.org`. The client is responsible for various operations such as fetching, creating, and searching issues, creating comments, and managing hooks. The Bitbucket plugin also defines issue types and priorities, which are used when creating or updating issues in Bitbucket.

<SwmSnippet path="/src/sentry_plugins/bitbucket/client.py" line="8">

---

# Bitbucket API Endpoints

The Bitbucket client in the Sentry plugin interacts with several Bitbucket API endpoints. These include endpoints for creating and managing issues, comments, and hooks, as well as retrieving repository and commit information. The client uses OAuth for authentication, as indicated by the `bind_auth` method. The `BITBUCKET_CONSUMER_KEY` and `BITBUCKET_CONSUMER_SECRET` are used for this purpose, as mentioned in the README file.

```python
class BitbucketClient(AuthApiClient):
    base_url = "https://api.bitbucket.org"
    plugin_name = "bitbucket"

    def has_auth(self):
        return (
            self.auth
            and "oauth_token" in self.auth.tokens
            and "oauth_token_secret" in self.auth.tokens
        )

    def bind_auth(self, **kwargs):
        kwargs["auth"] = OAuth1(
            str(settings.BITBUCKET_CONSUMER_KEY),
            str(settings.BITBUCKET_CONSUMER_SECRET),
            self.auth.tokens["oauth_token"],
            self.auth.tokens["oauth_token_secret"],
            signature_type="auth_header",
        )
        return kwargs

```

---

</SwmSnippet>

# Bitbucket OAuth Consumer Key and Secret

The Bitbucket client uses OAuth for authentication. The `BITBUCKET_CONSUMER_KEY` and `BITBUCKET_CONSUMER_SECRET` are required for this. These can be created at `https://bitbucket.org/account/user/YOUR_USERNAME/api` and then added to `sentry.conf.py`.

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
