---
title: What is Bitbucket
---
Bitbucket is a web-based version control repository hosting service, owned by Atlassian, for source code and development projects that use either Mercurial or Git revision control systems. In the context of the `demo-sentry` repository, Bitbucket is integrated to provide several features. These features include tracking commits and releases, resolving Sentry issues via Bitbucket commits, and creating Bitbucket issues from Sentry. The `BitbucketIntegrationProvider` class in `src/sentry/integrations/bitbucket/integration.py` is the main class responsible for this integration. It uses the Bitbucket API to interact with Bitbucket services, as seen in the `BitbucketAPIPath` class in `src/sentry/integrations/bitbucket/client.py`. The integration also involves handling Bitbucket's IP ranges, as defined in `src/sentry/integrations/bitbucket/constants.py`.

<SwmSnippet path="/src/sentry/integrations/bitbucket/webhook.py" line="109">

---

# Bitbucket Webhook Endpoint

The BitbucketWebhookEndpoint class defines the endpoint for handling Bitbucket webhooks. It includes methods for dispatching requests, handling POST requests, and getting the appropriate handler for an event type. The `PushEventWebhook` class is a specific handler for push events, which updates the repository data and creates commits in the Sentry system based on the received event.

```python
class BitbucketWebhookEndpoint(View):
    _handlers = {"repo:push": PushEventWebhook}

    def get_handler(self, event_type):
        return self._handlers.get(event_type)

    @method_decorator(csrf_exempt)
    def dispatch(self, request: Request, *args, **kwargs) -> Response:
        if request.method != "POST":
            return HttpResponse(status=405)

        return super().dispatch(request, *args, **kwargs)

    def post(self, request: Request, organization_id) -> Response:
        try:
            organization = Organization.objects.get_from_cache(id=organization_id)
        except Organization.DoesNotExist:
            logger.info(
                f"{PROVIDER_NAME}.webhook.invalid-organization",
                extra={"organization_id": organization_id},
            )
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket/descriptor.py" line="11">

---

# Bitbucket Descriptor Endpoint

The BitbucketDescriptorEndpoint class defines the endpoint for providing the descriptor of the Bitbucket integration. The descriptor includes information such as the key, name, description, vendor, base URL, authentication type, lifecycle endpoints, scopes, and other details of the integration.

```python
class BitbucketDescriptorEndpoint(Endpoint):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request: Request) -> Response:
        return self.respond(
            {
                "key": BITBUCKET_KEY,
                "name": "Sentry for Bitbucket",
                "description": "A Sentry integration",
                "vendor": {"name": "Sentry.io", "url": "https://sentry.io/"},
                "baseUrl": absolute_uri(),
                "authentication": {"type": "JWT"},
                "lifecycle": {
                    "installed": "/extensions/bitbucket/installed/",
                    "uninstalled": "/extensions/bitbucket/uninstalled/",
                },
                "scopes": scopes,
                "contexts": ["account"],
                # When the user is redirected the URL will become:
                # https://sentry.io/extensions/bitbucket/setup/?jwt=1212121212
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
