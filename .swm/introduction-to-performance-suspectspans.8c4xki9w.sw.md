---
title: Introduction to Performance SuspectSpans
---
In the context of the Sentry application, 'Performance SuspectSpans' refers to a feature that helps in identifying spans in a transaction that could be potential sources of performance issues. The 'SuspectSpans' type is an array of 'SuspectSpan' objects, each representing a span that is considered suspect. The 'SuspectSpansProps' type defines the properties that can be used to filter or sort the suspect spans. The 'SuspectSpansQuery' function is used to fetch the suspect spans based on the provided properties. The 'getSuspectSpanPayload' function prepares the request payload for fetching the suspect spans. The 'suspectSpans' member is used in various parts of the application, particularly in the performance and transaction summary views, to display and interact with the suspect spans.

<SwmSnippet path="/static/app/utils/performance/suspectSpans/spanOpsQuery.tsx" line="23">

---

# SpanOpsQuery Endpoint

The `SpanOpsQuery` component makes a request to the `events-span-ops` endpoint. This endpoint is used to fetch span operations data. The response data is then passed to the child component as `spanOps`.

```tsx
function SpanOpsQuery(props: Props) {
  return (
    <GenericDiscoverQuery<SpanOps, SpanOpsProps>
      route="events-span-ops"
      limit={20}
      {...omit(props, 'children')}
    >
      {({tableData, ...rest}) => {
        return props.children({spanOps: tableData, ...rest});
      }}
    </GenericDiscoverQuery>
  );
}

export default withApi(SpanOpsQuery);
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/performance/suspectSpans/suspectSpansQuery.tsx" line="55">

---

# SuspectSpansQuery Endpoint

The `SuspectSpansQuery` component makes a request to the `events-spans-performance` endpoint. This endpoint is used to fetch suspect spans data. The request payload is constructed in the `getSuspectSpanPayload` function. The response data is then passed to the child component as `suspectSpans`.

```tsx
function SuspectSpansQuery(props: Props) {
  return (
    <GenericDiscoverQuery<SuspectSpans, SuspectSpansProps>
      route="events-spans-performance"
      getRequestPayload={getSuspectSpanPayload}
      {...omit(props, 'children')}
    >
      {({tableData, ...rest}) => {
        return props.children({suspectSpans: tableData, ...rest});
      }}
    </GenericDiscoverQuery>
  );
}

export default withApi(SuspectSpansQuery);
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/performance/suspectSpans/spanExamplesQuery.tsx" line="42">

---

# SpanExamplesQuery Endpoint

The `SuspectSpansQuery` component makes a request to the `events-spans` endpoint. This endpoint is used to fetch span examples data. The request payload is constructed in the `getSuspectSpanPayload` function. The response data is then passed to the child component as `examples`.

```tsx
function SuspectSpansQuery(props: Props) {
  return (
    <GenericDiscoverQuery<SpanExample[], SpanExamplesProps>
      route="events-spans"
      getRequestPayload={getSuspectSpanPayload}
      {...omit(props, 'children')}
    >
      {({tableData, ...rest}) => {
        return props.children({
          examples: tableData ?? null,
          ...rest,
        });
      }}
    </GenericDiscoverQuery>
  );
}

export default withApi(SuspectSpansQuery);
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
