---
title: Getting started with Vercel Integration
---
Vercel Integration in Sentry is a feature that allows you to connect your Sentry and Vercel projects. This integration enables automatic upload of source maps and notifies Sentry of new releases being deployed on Vercel. Vercel is an all-in-one platform with Global CDN supporting static & JAMstack deployment and Serverless Functions. The integration is implemented in the `VercelIntegration` class in `src/sentry/integrations/vercel/integration.py`. This class handles the connection and configuration between Sentry and Vercel, including fetching and managing project data from Vercel. The `VercelIntegrationProvider` class is responsible for the integration setup and installation process.

<SwmSnippet path="/src/sentry/integrations/vercel/urls.py" line="8">

---

# Vercel Integration Endpoints

The `urls.py` file defines three main endpoints for the Vercel integration. The `/webhook/` endpoint is handled by the `VercelWebhookEndpoint` class, the `/configure/` endpoint is handled by the `VercelExtensionConfigurationView` class, and the `/delete/` endpoint is handled by the `VercelGenericWebhookEndpoint` class.

```python
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
]
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/vercel/generic_webhook.py" line="128">

---

# Vercel Generic Webhook Endpoint

The `VercelGenericWebhookEndpoint` class in the `generic_webhook.py` file handles the logic for the `/delete/` endpoint. This class defines methods for handling POST and DELETE requests. The `post` method handles deployment events and the `delete` method handles the deletion of integrations. The `_deployment_created` method is used to handle the creation of deployments.

```python
class VercelGenericWebhookEndpoint(Endpoint):
    authentication_classes = ()
    permission_classes = ()
    provider = "vercel"

    @csrf_exempt
    def dispatch(self, request: Request, *args, **kwargs) -> Response:
        return super().dispatch(request, *args, **kwargs)

    def post(self, request: Request) -> Response:
        if not request.META.get("HTTP_X_VERCEL_SIGNATURE"):
            logger.error("vercel.webhook.missing-signature")
            return self.respond(status=401)

        is_valid = verify_signature(request)

        if not is_valid:
            logger.error("vercel.webhook.invalid-signature")
            return self.respond(status=401)

        # Vercel's generic webhook allows you to subscribe to different events,
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
