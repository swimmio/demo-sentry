---
title: Understanding Plugins
---
In the context of the demo-sentry repository, plugins are components that extend the functionality of the application. They are defined as classes, such as `BasePlugin`, `DefaultIssuePlugin`, and `PluginSettings`, and are used throughout the codebase to provide additional features or integrations. For instance, `BasePlugin` is a foundational class that other plugins extend, and it contains a `plugin` property that holds the plugin data. `DefaultIssuePlugin` extends `BasePlugin` and provides additional methods for rendering group actions. `PluginSettings` is a class that manages the settings of a plugin, including fetching data, changing fields, and submitting changes. These plugins are used in various parts of the application, such as issue tracking, integration settings, and more.

<SwmSnippet path="/static/app/plugins/components/issueActions.tsx" line="131">

---

# Endpoints of Plugins

In the `issueActions.tsx` file, three endpoints are defined for different actions related to issues in plugins. These are `getPluginCreateEndpoint`, `getPluginLinkEndpoint`, and `getPluginUnlinkEndpoint`. These methods return the respective endpoints for creating, linking, and unlinking issues in the context of the plugin.

```tsx
  getPluginCreateEndpoint() {
    return (
      '/issues/' + this.getGroup().id + '/plugins/' + this.props.plugin.slug + '/create/'
    );
  }

  getPluginLinkEndpoint() {
    return (
      '/issues/' + this.getGroup().id + '/plugins/' + this.props.plugin.slug + '/link/'
    );
  }

  getPluginUnlinkEndpoint() {
    return (
      '/issues/' + this.getGroup().id + '/plugins/' + this.props.plugin.slug + '/unlink/'
    );
  }
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/plugins/components/settings.tsx" line="70">

---

# Plugin Settings

In the `settings.tsx` file, the `getPluginEndpoint` method is defined. This method returns the endpoint for the plugin settings. The endpoint is constructed using the organization slug, project slug, and plugin id.

```tsx
  }
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
