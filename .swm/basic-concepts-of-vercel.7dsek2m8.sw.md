---
title: Basic concepts of Vercel
---
Vercel is an all-in-one platform with Global CDN supporting static & JAMstack deployment and Serverless Functions. In the context of the Sentry repository, Vercel is integrated as a provider. The `VercelIntegrationProvider` class in `src/sentry/integrations/vercel/integration.py` defines the integration with Vercel. This class includes metadata about the integration, such as its name, key, and features. The `VercelIntegration` class, defined in the same file, handles the specific functionality of the integration, such as configuration and client creation. The `VercelClient` class in `src/sentry/integrations/vercel/client.py` is used to make requests to the Vercel API. The integration allows Sentry and Vercel projects to be connected, enabling automatic upload of source maps and notification of new releases being deployed.

<SwmSnippet path="/src/sentry/integrations/vercel/urls.py" line="1">

---

# Vercel Integration Endpoints

This file defines the URLs for the Vercel integration. There are three main endpoints: `webhook`, `configure`, and `delete`. The `webhook` endpoint is used to receive events from Vercel, the `configure` endpoint is used for the configuration view of the Vercel extension, and the `delete` endpoint is a generic webhook endpoint that handles various events.

```python
from django.conf.urls import url

from sentry.web.frontend.vercel_extension_configuration import VercelExtensionConfigurationView

from .generic_webhook import VercelGenericWebhookEndpoint
from .webhook import VercelWebhookEndpoint

urlpatterns = [
    url(r"^webhook/$", VercelWebhookEndpoint.as_view(), name="sentry-extensions-vercel-webhook"),
    url(
        r"^configure/$",
        VercelExtensionConfigurationView.as_view(),
        name="sentry-extensions-vercel-configure",
    ),
    # XXX(meredith): This route has become our generic hook, in
    # the future we'll need to update the route name to reflect that.
    url(
        r"^delete/$",
        VercelGenericWebhookEndpoint.as_view(),
        name="sentry-extensions-vercel-generic-webhook",
    ),
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/vercel/generic_webhook.py" line="28">

---

# Vercel Generic Webhook Endpoint

This file defines the `VercelGenericWebhookEndpoint` class, which handles the generic webhook events from Vercel. The `post` method handles incoming POST requests, verifies the signature of the request, and processes the event based on its type. The `delete` method handles DELETE requests and removes the corresponding integration configuration.

```python
logger = logging.getLogger("sentry.integrations.vercel.uninstall")


class NoCommitFoundError(IntegrationError):
    pass


class MissingRepositoryError(IntegrationError):
    pass


def verify_signature(request):
    # TODO(meredith): Pretty sure they always send both, but once we
    # get rid of old webhooks can update to just check VERCEL_SIGNATURE
    signature = request.META.get("HTTP_X_VERCEL_SIGNATURE") or request.META.get(
        "HTTP_X_ZEIT_SIGNATURE"
    )
    secret = options.get("vercel.client-secret")

    expected = hmac.new(
        key=secret.encode("utf-8"), msg=bytes(request.body), digestmod=hashlib.sha1
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
