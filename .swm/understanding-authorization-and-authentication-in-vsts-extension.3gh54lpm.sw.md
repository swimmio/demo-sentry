---
title: Understanding Authorization and Authentication in VSTS Extension
---
This document will cover the process of handling authorization and authentication in the VSTS Extension, which includes:

1. The role of the VstsExtensionIntegrationProvider class
2. The use of the TokenAuthExtension class
3. The function of the BaseOAuth1 class

<SwmSnippet path="/src/sentry/integrations/vsts_extension/integration.py" line="13">

---

# The role of the VstsExtensionIntegrationProvider class

The `VstsExtensionIntegrationProvider` class is a key component in the VSTS Extension's handling of authorization and authentication. It inherits from the `VstsIntegrationProvider` and overrides the `get_pipeline_views` and `build_integration` methods to customize the authentication flow. The `key` and `integration_key` attributes are used to identify the integration.

```python
class VstsExtensionIntegrationProvider(VstsIntegrationProvider):
    key = "vsts-extension"
    integration_key = "vsts"

    # This is only to enable the VSTS -> Sentry installation flow, so we don't
    # want it to actually appear of the Integrations page.
    visible = False

    def get_pipeline_views(self):
        views = super().get_pipeline_views()
        views = [view for view in views if not isinstance(view, AccountConfigView)]
        views.append(VstsExtensionFinishedView())
        return views

    def build_integration(self, state: MutableMapping[str, Any]) -> Mapping[str, Any]:
        state["account"] = {
            "accountId": state["vsts"]["accountId"],
            "accountName": state["vsts"]["accountName"],
        }

        return super().build_integration(state)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/apidocs/extensions.py" line="10">

---

# The use of the TokenAuthExtension class

The `TokenAuthExtension` class is used to handle token-based authentication. It defines the `get_security_requirement` and `get_security_definition` methods which are used to specify the security requirements for the API endpoints.

```python
class TokenAuthExtension(OpenApiAuthenticationExtension):  # type: ignore
    """
    Extension that adds what scopes are needed to access an endpoint to the
    OpenAPI Schema.
    """

    target_class = "sentry.api.authentication.TokenAuthentication"
    name = "auth_token"

    def get_security_requirement(self, auto_schema: AutoSchema) -> Dict[str, List[Any]]:
        scopes = set()
        for permission in auto_schema.view.get_permissions():
            for s in permission.scope_map.get(auto_schema.method, []):
                scopes.add(s)

        scope_list = list(scopes)
        scope_list.sort()
        return {self.name: scope_list}

    def get_security_definition(
        self, auto_schema: AutoSchema
```

---

</SwmSnippet>

<SwmSnippet path="/src/social_auth/backends/__init__.py" line="414">

---

# The function of the BaseOAuth1 class

The `BaseOAuth1` class is used to handle OAuth1 based authentication. It defines the `auth_url`, `auth_complete` and `do_auth` methods which are used to handle the OAuth1 authentication flow.

```python
class BaseOAuth1(OAuthAuth):
    """Consumer based mechanism OAuth authentication, fill the needed
    parameters to communicate properly with authentication service.

        AUTHORIZATION_URL       Authorization service url
        REQUEST_TOKEN_URL       Request token URL
        ACCESS_TOKEN_URL        Access token URL
    """

    AUTHORIZATION_URL = ""
    REQUEST_TOKEN_URL = ""
    ACCESS_TOKEN_URL = ""

    def auth_url(self):
        """Return redirect url"""
        token = self.unauthorized_token()
        name = self.AUTH_BACKEND.name + "unauthorized_token_name"
        if not isinstance(self.request.session.get(name), list):
            self.request.session[name] = []
        self.request.session[name].append(token.to_string())
        self.request.session.modified = True
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
