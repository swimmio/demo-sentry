---
title: OAuth Tokenization Process with Slack
---
This document will cover the management of the OAuth or tokenization process for Slack in the demo-sentry repository. We'll cover:

1. The SlackIdentityProvider class
2. The get_oauth_access_token_url function
3. The SlackOAuth2LoginView class
4. The get_authorize_params function

<SwmSnippet path="/src/sentry/identity/slack/provider.py" line="5">

---

# The SlackIdentityProvider class

The `SlackIdentityProvider` class is a key part of the OAuth process for Slack. It defines the URLs for authorization and access token retrieval, the client ID and secret, and the scopes required for the OAuth process. It also defines the pipeline views, which include the `SlackOAuth2LoginView` and `OAuth2CallbackView`.

```python
class SlackIdentityProvider(OAuth2Provider):
    key = "slack"
    name = "Slack"

    # This identity provider is used for authorizing the Slack application
    # through their Bot token (or legacy Workspace Token if enabled) flow.

    oauth_scopes = ("identity.basic", "identity.email")

    # Only used during installation for Bot apps in order to request "links:read"
    # user_scope, needed for unfurling.
    user_scopes = ()

    def get_oauth_authorize_url(self):
        return "https://slack.com/oauth/v2/authorize"

    # XXX(epurkhiser): While workspace tokens _do_ support the oauth.access
    # endpoint, it will not include the authorizing_user, so we continue to use
    # the deprecated oauth.token endpoint until we are able to migrate to a bot
    # app which uses oauth.access.
    def get_oauth_access_token_url(self):
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/identity/slack/provider.py" line="21">

---

# The get_oauth_access_token_url function

The `get_oauth_access_token_url` function returns the URL for retrieving the OAuth access token from Slack. This is used in the `OAuth2CallbackView` to get the access token after the user has authorized the application.

```python
    # XXX(epurkhiser): While workspace tokens _do_ support the oauth.access
    # endpoint, it will not include the authorizing_user, so we continue to use
    # the deprecated oauth.token endpoint until we are able to migrate to a bot
    # app which uses oauth.access.
    def get_oauth_access_token_url(self):
        return "https://slack.com/api/oauth.v2.access"
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
