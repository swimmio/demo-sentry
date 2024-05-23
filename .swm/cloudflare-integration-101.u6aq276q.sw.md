---
title: Cloudflare Integration 101
---
Cloudflare Integration in the Sentry repository is a way to connect Sentry with Cloudflare services. It is primarily implemented in the `src/sentry/integrations/cloudflare` directory. The integration involves two main components: `CloudflareMetadataEndpoint` and `CloudflareWebhookEndpoint`. The `CloudflareMetadataEndpoint` is responsible for handling metadata related to the integration, such as user information. On the other hand, `CloudflareWebhookEndpoint` handles the authentication process with Cloudflare and manages the webhook endpoints for receiving data from Cloudflare. The `CloudflareTokenAuthentication` class is used for token-based authentication with Cloudflare. The integration also involves logging, which is handled by the `logger` object.

<SwmSnippet path="/src/sentry/integrations/cloudflare/webhook.py" line="42">

---

# CloudflareWebhookEndpoint

The `CloudflareWebhookEndpoint` class is the main class that handles the webhook requests from Cloudflare. It includes several methods that handle different types of requests, such as `on_account_change`, `on_organization_change`, `on_project_change`, and others. Each of these methods is decorated with the `@requires_auth` decorator, which ensures that the user is authenticated before the request is processed. The `post` method is the entry point for all requests, which are then routed to the appropriate method based on the event type.

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

<SwmSnippet path="/src/sentry/integrations/cloudflare/webhook.py" line="28">

---

# CloudflareTokenAuthentication

The `CloudflareTokenAuthentication` class is used for authenticating the requests. It extracts the token from the request data and uses it to authenticate the credentials. This class is used as the authentication class in the `CloudflareWebhookEndpoint`.

```python
class CloudflareTokenAuthentication(TokenAuthentication):
    def authenticate(self, request: Request):
        # XXX(dcramer): Hack around CF needing a token in the JSON body,
        # but us additionally needing to verify the signature of the payload.
        # This technically lets a user brute force a token before we actually
        # verify the signature, HOWEVER, they could do that either way so we
        # are ok with it.
        try:
            token = request.data["authentications"]["account"]["token"]["token"]
        except KeyError:
            return None
        return self.authenticate_credentials(request, token)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/cloudflare/metadata.py" line="12">

---

# CloudflareMetadataEndpoint

The `CloudflareMetadataEndpoint` class handles requests for metadata. It has a `get` method that returns the username, user ID, and email of the authenticated user in the response.

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
