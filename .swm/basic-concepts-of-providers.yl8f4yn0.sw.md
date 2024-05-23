---
title: Basic concepts of Providers
---
In the context of the `demo-sentry` repository, 'Providers' are classes that handle authentication for different methods. They are located in the `src/sentry/auth/providers` directory. For example, the `SAML2Provider` in `saml2/provider.py` handles SAML2 authentication. It uses a class called `Attributes` to map user attributes from the SAML response to Sentry's user attributes. Another example is the `DummyProvider` in `dummy.py`, which is a simple provider used for testing purposes. Providers are used throughout the codebase to handle user authentication and identity management.

<SwmSnippet path="/src/sentry/auth/providers/github/constants.py" line="1">

---

# GitHub Authentication Constants

This file defines constants used for GitHub authentication. These include the client ID and secret, required for OAuth authentication with GitHub, and various error messages that might be displayed to the user during the authentication process. It also defines the URLs for accessing the access token and authorization endpoints of GitHub's OAuth service.

```python
from django.conf import settings

CLIENT_ID = settings.GITHUB_APP_ID

CLIENT_SECRET = settings.GITHUB_API_SECRET

REQUIRE_VERIFIED_EMAIL = settings.GITHUB_REQUIRE_VERIFIED_EMAIL

ERR_NO_ORG_ACCESS = "You do not have access to the required GitHub organization."

ERR_NO_PRIMARY_EMAIL = (
    "We were unable to find a primary email address associated with your GitHub account."
)

ERR_NO_SINGLE_PRIMARY_EMAIL = (
    "We were unable to find a single primary email address associated with your GitHub account."
)

ERR_NO_VERIFIED_PRIMARY_EMAIL = (
    "We were unable to find a verified, primary email address associated with your GitHub account."
)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/auth/providers/saml2/provider.py" line="23">

---

# SAML2 Authentication Provider

This file defines the SAML2 authentication provider. It includes classes and methods for handling SAML2 authentication, including views for login, ACS (Assertion Consumer Service), SLS (Single Logout Service), and metadata. It also includes methods for building the SAML configuration and the SAML auth object. The `get_provider` function retrieves the SAML2 provider for a given organization, and the `SAML2Provider` class defines the authentication pipeline and other methods required for SAML2 authentication.

```python
try:
    from onelogin.saml2.auth import OneLogin_Saml2_Auth, OneLogin_Saml2_Settings
    from onelogin.saml2.constants import OneLogin_Saml2_Constants

    HAS_SAML2 = True
except ImportError:
    HAS_SAML2 = False

    def OneLogin_Saml2_Auth(*args, **kwargs):
        raise NotImplementedError("Missing SAML libraries")

    def OneLogin_Saml2_Settings(*args, **kwargs):
        raise NotImplementedError("Missing SAML libraries")

    class OneLogin_Saml2_ConstantsType(type):
        def __getattr__(self, attr):
            raise NotImplementedError("Missing SAML libraries")

    class OneLogin_Saml2_Constants(metaclass=OneLogin_Saml2_ConstantsType):
        pass

```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
