---
title: What is VSTS Integration
---
VSTS Integration, also known as Azure DevOps Integration, is a feature in the Sentry application that allows users to connect their Sentry organization to one or more of their Azure DevOps organizations. This integration aims to streamline the bug squashing workflow by unifying Sentry and Azure DevOps. It provides features such as authorizing repositories to be added to your Sentry organization, creating and linking Sentry issue groups directly to an Azure DevOps work item, and automatically synchronizing comments and assignees to and from Azure DevOps. The integration is implemented in the `VstsIntegrationProvider` class and the `VstsIntegration` class in the `src/sentry/integrations/vsts/integration.py` file.

<SwmSnippet path="/src/sentry/integrations/vsts/repository.py" line="9">

---

# Repository Endpoints

This file defines the `VstsRepositoryProvider` class, which interacts with Azure DevOps repositories. It includes methods for getting repository data, building repository configuration, transforming changes, comparing commits, and more. These methods interact with Azure DevOps APIs to fetch and manipulate data related to repositories.

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

# Webhook Endpoints

This file defines the `WorkItemWebhook` class, which handles webhooks related to Azure DevOps work items. It includes methods for handling POST requests, checking webhook secrets, handling assignment changes, handling status changes, and more. These methods interact with Azure DevOps APIs to handle webhook events and update work items accordingly.

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
