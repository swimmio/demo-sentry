---
title: Understanding Monitors
---
In the context of the demo-sentry repo, 'Monitors' is a class defined in the `static/app/views/monitors/monitors.tsx` file. It extends the `AsyncView` class and is responsible for rendering the Monitors page in the application. This page displays a list of monitors, which are essentially automated checks that Sentry performs on your system. The Monitors class fetches the list of monitors from the server, handles search queries, and renders the list of monitors along with their status and other details. The Monitors class is used in various other files in the repo, indicating that the Monitors page is accessible from different parts of the application.

<SwmSnippet path="/static/app/views/monitors/monitorHeaderActions.tsx" line="33">

---

# Monitor API Endpoints

The `handleDelete` function makes a DELETE request to the `/monitors/${monitor.id}/` endpoint. This endpoint is used to delete a specific monitor identified by its ID.

```tsx
    api
      .requestPromise(`/monitors/${monitor.id}/`, {
        method: 'DELETE',
      })
      .then(() => {
        browserHistory.push(redirectPath);
      })
      .catch(() => {
        addErrorMessage(t('Unable to remove monitor.'));
      });
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/monitors/monitorHeaderActions.tsx" line="47">

---

The `updateMonitor` function makes a PUT request to the `/monitors/${monitor.id}/` endpoint. This endpoint is used to update a specific monitor's data.

```tsx
    api
      .requestPromise(`/monitors/${monitor.id}/`, {
        method: 'PUT',
        data,
      })
      .then(resp => {
        clearIndicators();
        onUpdate?.(resp);
      })
      .catch(err => {
        logException(err);
        addErrorMessage(t('Unable to update monitor.'));
      });
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/monitors/monitorIssues.tsx" line="12">

---

The `MonitorIssues` component makes a GET request to the `/organizations/${orgId}/issues/` endpoint. This endpoint is used to fetch issues associated with a specific monitor.

```tsx
  <IssueList
    endpoint={`/organizations/${orgId}/issues/`}
    query={{
      query: 'monitor.id:"' + monitor.id + '"',
      project: monitor.project.id,
      limit: 5,
    }}
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
