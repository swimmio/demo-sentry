---
title: Unraveling Application Integrations in the Sentry Project
---
This document will cover the process of how Sentry integrates with other applications. We'll cover:

1. The structure of integration objects
2. How integrations are implemented in the codebase
3. Examples of specific integrations with applications like Jira, GitHub, Vercel, PagerDuty, and Azure DevOps.

<SwmSnippet path="/static/app/types/integrations.tsx" line="150">

---

# Structure of Integration Objects

In the `integrations.tsx` file, we define several types related to integrations. The `SentryApp` type represents the integration itself, while `SentryAppInstallation` and `SentryAppComponent` are related to the installation and components of the integration respectively.

```tsx
export type SentryApp = {
  author: string;
  events: WebhookEvent[];
  featureData: IntegrationFeature[];
  isAlertable: boolean;
  name: string;
  overview: string | null;
  // possible null params
  popularity: number | null;
  redirectUrl: string | null;
  schema: {
    elements?: SentryAppSchemaElement[];
  };
  scopes: Scope[];
  slug: string;
  status: SentryAppStatus;
  uuid: string;
  verifyInstall: boolean;
  webhookUrl: string | null;
  avatars?: Avatar[];
  clientId?: string;
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/jira/integration.py" line="42">

---

# Implementation of Integrations

In the `integration.py` file of each integration, we define the integration's features, metadata, and other necessary information. For example, in the Jira integration, we define the description, features, installation notice, and metadata of the integration.

```python
logger = logging.getLogger("sentry.integrations.jira")

DESCRIPTION = """
Connect your Sentry organization into one or more of your Jira cloud instances.
Get started streamlining your bug squashing workflow by unifying your Sentry and
Jira instances together.
"""

FEATURE_DESCRIPTIONS = [
    FeatureDescription(
        """
        Create and link Sentry issue groups directly to a Jira ticket in any of your
        projects, providing a quick way to jump from a Sentry bug to tracked ticket!
        """,
        IntegrationFeatures.ISSUE_BASIC,
    ),
    FeatureDescription(
        """
        Automatically synchronize assignees to and from Jira. Don't get confused
        who's fixing what, let us handle ensuring your issues and tickets match up
        to your Sentry and Jira assignees.
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/github/integration.py" line="34">

---

# Examples of Specific Integrations

Each integration has its own specific implementation. For instance, the GitHub integration has a description and features specific to GitHub, and it also defines API errors that might occur during the integration.

```python
DESCRIPTION = """
Connect your Sentry organization into your GitHub organization or user account.
Take a step towards augmenting your sentry issues with commits from your
repositories ([using releases](https://docs.sentry.io/learn/releases/)) and
linking up your GitHub issues and pull requests directly to issues in Sentry.
"""

FEATURES = [
    FeatureDescription(
        """
        Authorize repositories to be added to your Sentry organization to augment
        sentry issues with commit data with [deployment
        tracking](https://docs.sentry.io/learn/releases/).
        """,
        IntegrationFeatures.COMMITS,
    ),
    FeatureDescription(
        """
        Create and link Sentry issue groups directly to a GitHub issue or pull
        request in any of your repositories, providing a quick way to jump from
        Sentry bug to tracked issue or PR!
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
