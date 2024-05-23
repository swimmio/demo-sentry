---
title: Getting started with Cloudflare
---
Cloudflare is a global network designed to make everything you connect to the Internet secure, private, fast, and reliable. In the context of the `demo-sentry` repository, Cloudflare is integrated to enhance the security and performance of the application. The `src/sentry/integrations/cloudflare` directory contains the code for this integration. It includes classes like `CloudflareWebhookEndpoint` and `CloudflareMetadataEndpoint` which handle the interactions with Cloudflare's services. For instance, `CloudflareWebhookEndpoint` is responsible for authenticating and processing incoming webhooks from Cloudflare, while `CloudflareMetadataEndpoint` provides user metadata to Cloudflare. These classes use Cloudflare's APIs to communicate and exchange data, ensuring the application's robustness and reliability.

<SwmSnippet path="/src/sentry/integrations/cloudflare/webhook.py" line="42">

---

# CloudflareWebhookEndpoint

The `CloudflareWebhookEndpoint` class in `webhook.py` is a key part of the Cloudflare integration in Sentry. It defines several methods that handle different types of events, such as `on_account_change`, `on_organization_change`, and `on_project_change`. These methods are triggered when the corresponding event occurs in Cloudflare. The `post` method is the main entry point for handling incoming webhook requests. It checks the signature of the request, determines the type of event, and calls the appropriate handler method.

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

# CloudflareMetadataEndpoint

The `CloudflareMetadataEndpoint` class in `metadata.py` handles requests for metadata related to Cloudflare. The `get` method returns a response containing the username, user ID, and email of the authenticated user. This information can be used by Cloudflare to identify the user.

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
