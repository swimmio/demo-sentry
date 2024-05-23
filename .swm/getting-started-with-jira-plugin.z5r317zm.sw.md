---
title: Getting started with Jira Plugin
---
The Jira Plugin in the demo-sentry repository is a tool that integrates Sentry with Jira, a popular issue tracking system. The plugin is defined in the `Jira` class in `static/app/plugins/jira/index.tsx`. It extends the `DefaultIssuePlugin` class and includes methods for rendering settings and group actions. The plugin allows Sentry to connect with one or more Jira instances, streamlining the bug tracking workflow. It enables the creation and linking of Sentry issue groups directly to a Jira ticket in any project, providing a quick way to jump from a Sentry bug to a tracked ticket. The plugin also automatically synchronizes assignees between Sentry and Jira, ensuring that issues and tickets match up. The `displayName` property of the `Jira` class is set to 'Jira', indicating the name of the plugin.

<SwmSnippet path="/static/app/plugins/jira/components/settings.tsx" line="44">

---

# Jira Plugin Settings Endpoint

The `fetchData` method in the `Settings` class is responsible for fetching the plugin's settings from the backend. It sends a GET request to the plugin's endpoint and updates the component's state with the received data. The state includes the configuration fields and their values, as well as the default project.

```tsx
  fetchData() {
    // This is mostly copy paste of parent class
    // except for setting edit state
    this.api.request(this.getPluginEndpoint(), {
      success: (data: ApiData) => {
        const formData: Record<string, any> = {};
        const initialData = {};
        data.config.forEach(field => {
          formData[field.name] = field.value || field.defaultValue;
          initialData[field.name] = field.value;
        });
        this.setState(
          {
            fieldList: data.config,
            formData,
            initialData,
            // start off in edit mode if there isn't a project set
            editing: !(formData && formData.default_project),
            // call this here to prevent FormState.READY from being
            // set before fieldList is
          },
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/plugins/jira/components/issueActions.tsx" line="26">

---

# Jira Plugin Issue Actions Endpoint

The `changeField` method in the `IssueActions` class is responsible for handling changes to the issue fields. When the issue type is changed, it sends a GET request to the plugin's create endpoint with the new issue type as a parameter. The response data is used to update the form fields and their values.

```tsx
        this.onLoad.bind(this, () => {
          this.api.request(
            this.getPluginCreateEndpoint() + '?issuetype=' + encodeURIComponent(value),
            {
              success: (data: DefaultIssueActions['state']['unlinkFieldList']) => {
                // Try not to change things the user might have edited
                // unless they're no longer valid
                const oldData = this.state.createFormData;
                const createFormData = {};
                data?.forEach(field => {
                  let val;
                  if (
                    field.choices &&
                    !field.choices.find(c => c[0] === oldData[field.name])
                  ) {
                    val = field.default;
                  } else {
                    val = oldData[field.name] || field.default;
                  }
                  createFormData[field.name] = val;
                });
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
