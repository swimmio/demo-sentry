---
title: Overview of Cloudflare
---
Cloudflare is a global cloud network platform that provides various services including content delivery network (CDN), DDoS protection, and security solutions. In the context of the `demo-sentry` repository, Cloudflare is integrated to enhance the application's security and performance. The `src/sentry/integrations/cloudflare` directory contains the implementation of this integration. It includes classes like `CloudflareWebhookEndpoint` and `CloudflareMetadataEndpoint` which handle the interactions between Sentry and Cloudflare. The `CloudflareTokenAuthentication` class is used for authenticating requests from Cloudflare. These classes are part of the Sentry's extensible integration system, allowing it to work seamlessly with Cloudflare.

<SwmSnippet path="/src/sentry/integrations/cloudflare/webhook.py" line="42">

---

# Cloudflare Webhook Endpoint

The `CloudflareWebhookEndpoint` class in `webhook.py` is an API endpoint that handles various webhook events from Cloudflare. It includes methods for authenticating the request, verifying the payload signature, and handling different types of events such as account, organization, and project changes. The `post` method is the main entry point for this endpoint, which processes the incoming request, verifies the signature, and dispatches the request to the appropriate handler based on the event type.

```python
class CloudflareWebhookEndpoint(Endpoint):
    authentication_classes = (CloudflareTokenAuthentication,)
    permission_classes = ()

    def verify(self, payload, key, signature):
        return constant_time_compare(
            signature,
            hmac.new(key=key.encode("utf-8"), msg=payload, digestmod=sha256).hexdigest(),
        )

    def organization_from_json(self, request: Request, data, scope="project:write"):
        try:
            organization_id = data["install"]["options"]["organization"]
        except KeyError:
            return None

        organizations = Organization.objects.get_for_user(request.user, scope=scope)
        for org in organizations:
            if str(org.id) == organization_id:
                return org
        return None
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/cloudflare/metadata.py" line="12">

---

# Cloudflare Metadata Endpoint

The `CloudflareMetadataEndpoint` class in `metadata.py` is an API endpoint that returns metadata about the authenticated user. The `get` method is the main entry point for this endpoint, which logs the request and returns a response containing the user's username, user ID, and email.

```python
class CloudflareMetadataEndpoint(Endpoint):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request) -> Response:
        logger.info("cloudflare.metadata", extra={"user_id": request.user.id})
        return Response(
            {
                "metadata": {
                    "username": request.user.username,
                    "userId": str(request.user.id),
                    "email": request.user.email,
                }
            }
        )
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
