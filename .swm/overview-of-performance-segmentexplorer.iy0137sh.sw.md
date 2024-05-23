---
title: Overview of Performance SegmentExplorer
---
The Performance SegmentExplorer in the Sentry demo repository is a feature that allows for detailed exploration of performance data. It is implemented in the `segmentExplorerQuery.tsx` file. The main function, `SegmentExplorerQuery`, uses the `GenericDiscoverQuery` component to fetch data related to performance segments. The data fetched includes various metrics such as aggregate, comparison, count, frequency, and sumdelta. These metrics are defined in the `TableDataRow` type and are used to provide a comprehensive view of the performance data. The `SegmentExplorerQuery` function also uses the `getRequestFunction` to prepare the payload for the API request. This function takes into account various query parameters like aggregateColumn, sort, allTagKeys, and tagKey to customize the data fetched. The `SegmentExplorerQuery` function then returns the fetched data in the form of `TableData` which includes the data rows and metadata. This data can then be used for further analysis and visualization.

<SwmSnippet path="/static/app/utils/performance/segmentExplorer/tagKeyHistogramQuery.tsx" line="77">

---

# Performance SegmentExplorer Endpoints

The `TagKeyHistogramQuery` function in `tagKeyHistogramQuery.tsx` defines an endpoint that fetches histogram data for a specific tag key. It uses the `GenericDiscoverQuery` component with the `events-facets-performance-histogram` route, and it passes a request payload that includes parameters like `aggregateColumn`, `sort`, `tagKey`, and `numBucketsPerKey`.

```tsx
function TagKeyHistogramQuery(props: QueryProps) {
  return (
    <GenericDiscoverQuery<TableData, QueryProps>
      route="events-facets-performance-histogram"
      getRequestPayload={getRequestFunction(props)}
      shouldRefetchData={shouldRefetchData}
      {...props}
    />
  );
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/performance/segmentExplorer/segmentExplorerQuery.tsx" line="80">

---

The `SegmentExplorerQuery` function in `segmentExplorerQuery.tsx` defines an endpoint that fetches performance data for a specific segment. It uses the `GenericDiscoverQuery` component with the `events-facets-performance` route, and it passes a request payload that includes parameters like `aggregateColumn`, `sort`, `allTagKeys`, and `tagKey`.

```tsx
function SegmentExplorerQuery(props: QueryProps) {
  return (
    <GenericDiscoverQuery<TableData, QueryProps>
      route="events-facets-performance"
      getRequestPayload={getRequestFunction(props)}
      shouldRefetchData={shouldRefetchData}
      {...props}
    />
  );
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/performance/segmentExplorer/tagTransactionsQuery.tsx" line="27">

---

The `TagTransactionsQuery` function in `tagTransactionsQuery.tsx` defines an endpoint that fetches transaction data for a specific tag. It uses the `GenericDiscoverQuery` component with the `eventsv2` route, and it passes a request payload that includes a `query` parameter.

```tsx
function TagTransactionsQuery(props: QueryProps) {
  return (
    <GenericDiscoverQuery<TableData, QueryProps>
      route="eventsv2"
      shouldRefetchData={shouldRefetchData}
      {...props}
    />
  );
}
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
