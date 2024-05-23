---
title: Understanding VSTS
---
VSTS, now known as Azure DevOps, is a Microsoft product that provides version control, reporting, requirements management, project management, automated builds, lab management, testing and release management capabilities. It covers the entire application lifecycle and enables DevOps capabilities. In the context of the `demo-sentry` repository, VSTS is integrated to streamline the bug squashing workflow by unifying Sentry and Azure DevOps. This integration allows repositories to be added to the Sentry organization to augment Sentry issues with commit data and deployment tracking. It also enables the creation and linking of Sentry issue groups directly to an Azure DevOps work item in any project, providing a quick way to jump from a Sentry bug to a tracked work item. Moreover, it automatically synchronizes comments and assignees to and from Azure DevOps.

<SwmSnippet path="/src/sentry/integrations/vsts/repository.py" line="9">

---

# VSTS Repository Provider

This file defines the `VstsRepositoryProvider` class which is responsible for handling repositories in Azure DevOps. It includes methods for getting repository data, building repository configurations, transforming changes, and comparing commits. These methods interact with the Azure DevOps API to fetch and manipulate data.

```python
class VstsRepositoryProvider(IntegrationRepositoryProvider):  # type: ignore
    name = "Azure DevOps"
    repo_provider = "vsts"

    def get_repository_data(
        self, organization: Organization, config: MutableMapping[str, Any]
    ) -> Mapping[str, str]:
        installation = self.get_installation(config.get("installation"), organization.id)
        client = installation.get_client()
        instance = installation.instance

        repo_id = config["identifier"]

        try:
            repo = client.get_repo(instance, repo_id)
        except Exception as e:
            raise installation.raise_error(e)
        config.update(
            {
                "instance": instance,
                "project": repo["project"]["name"],
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/vsts/webhooks.py" line="21">

---

# VSTS Webhooks

This file defines the `WorkItemWebhook` class which handles incoming webhooks from Azure DevOps. The `post` method is the endpoint that Azure DevOps sends requests to when a work item is updated. The webhook data is processed and actions are taken based on the event type and data.

```python
class WorkItemWebhook(Endpoint):  # type: ignore
    authentication_classes = ()
    permission_classes = ()

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        data = request.data
        try:
            event_type = data["eventType"]
            external_id = data["resourceContainers"]["collection"]["id"]
        except KeyError as e:
            logger.info("vsts.invalid-webhook-payload", extra={"error": str(e)})
            return self.respond(status=status.HTTP_400_BAD_REQUEST)

        # https://docs.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#workitem.updated
        if event_type == "workitem.updated":
            try:
                integration = Integration.objects.get(
                    provider=PROVIDER_KEY, external_id=external_id
                )
            except Integration.DoesNotExist:
                logger.info(
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
