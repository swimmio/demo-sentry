---
title: Tracking Commits and Resolving Issues with Bitbucket Server Integration
---
This document will cover the process of commit and release tracking, as well as resolving issues via Bitbucket Server commits. We'll cover:

1. How commit and release tracking is implemented
2. How issues are resolved via Bitbucket Server commits
3. The role of Bitbucket Server Integration in this process.

<SwmSnippet path="/src/sentry/models/releasecommit.py" line="4">

---

# Commit and Release Tracking Implementation

The `ReleaseCommit` model is a key part of how commit and release tracking is implemented. It links a release to a commit and maintains the order of commits for a release.

```python
class ReleaseCommit(Model):
    __include_in_export__ = False

    organization_id = BoundedPositiveIntegerField(db_index=True)
    # DEPRECATED
    project_id = BoundedPositiveIntegerField(null=True)
    release = FlexibleForeignKey("sentry.Release")
    commit = FlexibleForeignKey("sentry.Commit")
    order = BoundedPositiveIntegerField()

    class Meta:
        app_label = "sentry"
        db_table = "sentry_releasecommit"
        unique_together = (("release", "commit"), ("release", "order"))

    __repr__ = sane_repr("release_id", "commit_id", "order")
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/integration.py" line="221">

---

# Resolving Issues via Bitbucket Server Commits

The `BitbucketServerIntegration` class is responsible for integrating Bitbucket Server with Sentry. It includes methods for getting repositories and checking repo access, which are crucial for resolving issues via Bitbucket Server commits.

```python
class BitbucketServerIntegration(IntegrationInstallation, RepositoryMixin):
    """
    IntegrationInstallation implementation for Bitbucket Server
    """

    repo_search = True

    default_identity = None

    def get_client(self):
        if self.default_identity is None:
            try:
                self.default_identity = self.get_default_identity()
            except Identity.DoesNotExist:
                raise IntegrationError("Identity not found.")

        return BitbucketServer(
            self.model.metadata["base_url"],
            self.default_identity.data,
            self.model.metadata["verify_ssl"],
        )
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/bitbucket_server/client.py" line="22">

---

# Role of Bitbucket Server Integration

The `BitbucketServerAPIPath` class defines the API paths used by the Bitbucket Server Integration. The `commit_changes` path is particularly important for tracking changes to commits.

```python
    repository_hooks = "/rest/api/1.0/projects/{project}/repos/{repo}/webhooks"
    repository_commits = "/rest/api/1.0/projects/{project}/repos/{repo}/commits"
    commit_changes = "/rest/api/1.0/projects/{project}/repos/{repo}/commits/{commit}/changes"
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
