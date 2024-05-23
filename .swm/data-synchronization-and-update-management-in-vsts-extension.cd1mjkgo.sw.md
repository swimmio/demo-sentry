---
title: Data Synchronization and Update Management in VSTS Extension
---
This document will cover the process of data syncing and updating in the VSTS Extension, which includes:

1. The role of the VstsIntegration class
2. The use of outbound and inbound keys
3. The function of update_organization_config method

<SwmSnippet path="/src/sentry/integrations/vsts/integration.py" line="110">

---

# The role of the VstsIntegration class

The `VstsIntegration` class is the main class responsible for managing the integration between Sentry and Azure DevOps. It includes methods for syncing repositories, checking repo access, and getting client details.

```python
class VstsIntegration(IntegrationInstallation, RepositoryMixin, VstsIssueSync):  # type: ignore
    logger = logger
    comment_key = "sync_comments"
    outbound_status_key = "sync_status_forward"
    inbound_status_key = "sync_status_reverse"
    outbound_assignee_key = "sync_forward_assignment"
    inbound_assignee_key = "sync_reverse_assignment"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.default_identity: Identity | None = None

    def reinstall(self) -> None:
        self.reinstall_repositories()

    def all_repos_migrated(self) -> bool:
        return not self.get_unmigratable_repositories()

    def get_repositories(self, query: str | None = None) -> Sequence[Mapping[str, str]]:
        try:
            repos = self.get_client().get_repos(self.instance)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/vsts/integration.py" line="112">

---

# The use of outbound and inbound keys

The `outbound_status_key`, `inbound_status_key`, `outbound_assignee_key`, and `inbound_assignee_key` are used to manage the syncing of status and assignee data between Sentry and Azure DevOps.

```python
    comment_key = "sync_comments"
    outbound_status_key = "sync_status_forward"
    inbound_status_key = "sync_status_reverse"
    outbound_assignee_key = "sync_forward_assignment"
    inbound_assignee_key = "sync_reverse_assignment"
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
