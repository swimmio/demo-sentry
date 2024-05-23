---
title: Identification of data transformations within notification strategies
---
This document will cover the transformations that happen to the data within the strategies in the demo-sentry repository. We'll cover:

1. How data is transformed in the usage chart.
2. How data is transformed in the EventsRequest component.
3. How data is transformed in the forms model.

<SwmSnippet path="/static/app/views/organizationStats/usageChart/index.tsx" line="155">

---

# Data Transformation in Usage Chart

The `handleDataTransformation` function in the usage chart is responsible for transforming the usage stats based on the selected transformation method. It creates a new `chartData` object and populates it with transformed data from the original stats. The transformation is determined by the `isCumulative` flag, which indicates whether the data should be accumulated over time or not.

```tsx
    handleDataTransformation: (stats, transform) => {
      const chartData: ChartStats = {
        accepted: [],
        dropped: [],
        projected: [],
        filtered: [],
      };
      const isCumulative = transform === ChartDataTransform.CUMULATIVE;

      Object.keys(stats).forEach(k => {
        let count = 0;

        chartData[k] = stats[k].map(stat => {
          const [x, y] = stat.value;
          count = isCumulative ? count + y : y;

          return {
            ...stat,
            value: [x, count],
          };
        });
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/charts/eventsRequest.tsx" line="404">

---

# Data Transformation in EventsRequest Component

The `get_crash_frame_from_event_data` function in the EventsRequest component is used to find the highest in-app frame in the top stacktrace which doesn't fail a given filter test. If no such frame is available, it returns the highest non-in-app frame. If there are no frames, or all frames fail the filter test, it returns None.

```tsx
  /**
   * Transforms query response into timeseries data to be used in a chart
   */
  transformTimeseriesData(data: EventsStatsData, seriesName?: string): Series[] {
    return [
      {
        seriesName: seriesName || 'Current',
        data: data.map(([timestamp, countsForTimestamp]) => ({
          name: timestamp * 1000,
          value: countsForTimestamp.reduce((acc, {count}) => acc + count, 0),
        })),
      },
    ];
  }

  /**
   * Transforms comparisonCount in query response into timeseries data to be used in a comparison chart for change alerts
   */
  transformComparisonTimeseriesData(data: EventsStatsData): Series[] {
    return [
      {
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/forms/model.tsx" line="249">

---

# Data Transformation in Forms Model

The `getTransformedData` function in the forms model is used to transform the form data into a format that can be sent to the API endpoint. It iterates over all keys in the form data, transforms each value using the `getTransformedValue` function, and returns a new object with the transformed data.

```tsx
  /**
   * Form data that will be sent to API endpoint (i.e. after transforms)
   */
  getTransformedData() {
    const form = this.getData();

    return Object.keys(form)
      .map(id => [id, this.getTransformedValue(id)])
      .reduce((acc, [id, value]) => {
        acc[id] = value;
        return acc;
      }, {});
  }
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
