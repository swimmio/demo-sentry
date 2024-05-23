---
title: Basic concepts of Performance QuickTrace
---
Performance QuickTrace is a feature in the Sentry application that provides a visual representation of the trace data surrounding an event. It helps in understanding the sequence of transactions and events that lead to a specific event in a system. The QuickTrace feature is implemented in the `static/app/utils/performance/quickTrace` directory. The `ParsedQuickTrace` type is a key part of this feature, representing the structured trace data with information about the current event, its parent, children, descendants, and the root of the trace. The `parseQuickTrace` function is used to transform the raw trace data into a `ParsedQuickTrace` object. The `QuickTraceQuery` function uses this parsed data to generate the QuickTrace view. The `trace`, `isFullTrace`, `subtrace`, `parent`, `children`, `root` constants play crucial roles in this process.

<SwmSnippet path="/static/app/utils/performance/quickTrace/traceLiteQuery.tsx" line="36">

---

# TraceLiteQuery Endpoint

The `TraceLiteQuery` component is responsible for fetching a simplified version of the trace data from the `events-trace-light` endpoint. It takes in the trace ID, start and end timestamps, and other props, and returns the trace data or an error if the trace ID is not provided or if the request fails.

```tsx
  const additionalApiPayload = getTraceRequestPayload(props);
  return Object.assign({event_id: eventId}, additionalApiPayload);
}

function EmptyTrace({children}: Pick<QueryProps, 'children'>) {
  return (
    <React.Fragment>
      {children({
        isLoading: false,
        error: null,
        trace: null,
        type: 'partial',
      })}
    </React.Fragment>
  );
}

function TraceLiteQuery({
  traceId,
  start,
  end,
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/performance/quickTrace/traceFullQuery.tsx" line="64">

---

# TraceFullQuery Endpoint

The `TraceFullQuery` component fetches the full trace data from the `events-trace` endpoint. It also takes in the trace ID, start and end timestamps, and other props, and returns the full trace data or an error if the trace ID is not provided or if the request fails. This endpoint provides more detailed information about the trace, including parent-child relationships between events.

```tsx
function GenericTraceFullQuery<T>({
  traceId,
  start,
  end,
  statsPeriod,
  children,
  ...props
}: QueryProps<T>) {
  if (!traceId) {
    return <EmptyTrace<T>>{children}</EmptyTrace>;
  }

  const eventView = makeEventView({start, end, statsPeriod});

  return (
    <GenericDiscoverQuery<T, AdditionalQueryProps>
      route={`events-trace/${traceId}`}
      getRequestPayload={getTraceFullRequestPayload}
      eventView={eventView}
      {...props}
    >
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
