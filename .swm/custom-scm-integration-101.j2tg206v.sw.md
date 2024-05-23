---
title: Custom SCM Integration 101
---
Custom Source Control Management (SCM) Integration in the Sentry application allows developers to integrate their own source control management system with Sentry. This integration provides features like sending your own commits and linking stack traces. The `CustomSCMIntegrationProvider` class in `src/sentry/integrations/custom_scm/integration.py` is the main entry point for this integration. It requires a feature flag to be enabled. The `dispatch` function in `src/sentry/integrations/custom_scm/repository.py` is responsible for adding a repository to the Custom SCM integration. It changes the provider from `null` to 'integrations:custom_scm' and adds the integration_id that is passed from the request. The `save` function is then called to save the changes and the `serialize` function is used to prepare the data for the response.

<SwmSnippet path="/src/sentry/integrations/custom_scm/repository.py" line="10">

---

# CustomSCMRepositoryProvider Class

The `CustomSCMRepositoryProvider` class is a part of the Custom SCM integration. It is responsible for handling repositories. The `dispatch` method is an endpoint that handles the addition of a repository to the Custom SCM integration. It does this in two steps: 1. Changing the provider from `null` to 'integrations:custom_scm' and 2. Adding the integration_id that is passed from the request. The `identifier` is set to be the repo's id in our database when we call `get_repositories`. This is usually the id or identifier in the other service (i.e., the GH repo id).

```python
class CustomSCMRepositoryProvider(IntegrationRepositoryProvider):
    name = "CustomSCM"
    repo_provider = "custom_scm"

    def repository_external_slug(self, repo):
        return repo.name

    def dispatch(self, request: Request, organization, **kwargs):
        """
        Adding a repository to the Custom SCM integration is
        just two steps:
           1. Change the provider from `null` to 'integrations:custom_scm'
           2. Add the integration_id that is passed from the request

        We set the `identifier` to be the repo's id in our db
        when we call `get_repositories`. Normally this is the id or
        identifier in the other service (i.e. the GH repo id)
        """
        repo_id = request.data.get("identifier")
        integration_id = request.data.get("installation")

```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
