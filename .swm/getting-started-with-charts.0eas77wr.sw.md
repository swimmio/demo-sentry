---
title: Getting started with Charts
---
In the `demo-sentry` repository, 'Charts' refer to the visual representations of data, specifically using the ECharts library. The charts are primarily defined and manipulated in the `static/app/components/charts` directory. The `BaseChart` component in `baseChart.tsx` is a fundamental component that sets up the chart container and chart options, including tooltip styling, grid layout, and series data. The `EventsChart` component in `eventsChart.tsx` is a more specific chart type that deals with event data. It uses various props to customize the chart, such as `currentSeriesNames`, `loading`, `chartOptions`, and more. The `chartOptions` constant is particularly important as it defines the visual aspects and behavior of the chart, such as colors, grid positioning, tooltip triggers, and axis information. The `seriesData` constant is used to hold the data that will be displayed on the chart.

<SwmSnippet path="/static/app/components/charts/sessionsRequest.tsx" line="64">

---

# Chart Endpoints

The `SessionsRequest` component fetches session data for a specific organization. The endpoint for this request is defined in the `path` getter method, which returns a string in the format `/organizations/{organization.slug}/sessions/`. The `organization.slug` is extracted from the `props` of the component.

```tsx
  get path() {
    const {organization} = this.props;

    return `/organizations/${organization.slug}/sessions/`;
  }
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/charts/releaseSeries.tsx" line="40">

---

The `getOrganizationReleases` function fetches release data for a specific organization. The endpoint for this request is `/organizations/{organization.slug}/releases/stats/`. The `organization.slug` is passed as an argument to the function.

```tsx
function getOrganizationReleases(
  api: Client,
  organization: Organization,
  conditions: ReleaseConditions
) {
  const query = {};
  Object.keys(conditions).forEach(key => {
    let value = conditions[key];
    if (value && (key === 'start' || key === 'end')) {
      value = getUtcDateString(value);
    }
    if (value) {
      query[key] = value;
    }
  });
  api.clear();
  return api.requestPromise(`/organizations/${organization.slug}/releases/stats/`, {
    includeAllArgs: true,
    method: 'GET',
    query,
  }) as Promise<[ReleaseMetaBasic[], any, ResponseMeta]>;
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
