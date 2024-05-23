---
title: Understanding Performance Vitals
---
Performance Vitals in the Sentry application refers to key metrics that provide insights into the performance of a web application. These vitals are represented as `WebVital` objects, each containing specific performance data. The `VitalsData` type is a record of these vitals, where each `VitalData` object represents the performance data for a specific metric, including values like 'good' and 'meh' to categorize the performance. The `VitalsCardsDiscoverQuery` function is used to fetch these vitals data for the application. The `vitals` property in various types like `VitalsProps`, `VitalGroup`, and `RequestProps` refers to an array of these `WebVital` objects. Overall, Performance Vitals provide a way to monitor and improve the user experience of a web application.

<SwmSnippet path="/static/app/utils/performance/vitals/vitalsDetailsTableQuery.tsx" line="65">

---

# Performance Vitals Endpoints

The `VitalsCardsDiscoverQuery` function in `vitalsDetailsTableQuery.tsx` is a React component that makes a request to the `eventsv2` endpoint. This endpoint is used to fetch data related to performance vitals, which is then displayed in a table format.

```tsx
function VitalsCardsDiscoverQuery(props: QueryProps) {
  return <GenericDiscoverQuery<TableData, QueryProps> route="eventsv2" {...props} />;
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/performance/vitals/hasMeasurementsQuery.tsx" line="43">

---

In `hasMeasurementsQuery.tsx`, the `HasMeasurementsQuery` function is another React component that makes a request to the `events-has-measurements` endpoint. This endpoint checks if there are any measurements for a given transaction and type (either 'web' or 'mobile').

```tsx
function HasMeasurementsQuery(props: Props) {
  return (
    <GenericDiscoverQuery<HasMeasurements, HasMeasurementsProps>
      route="events-has-measurements"
      getRequestPayload={getHasMeasurementsRequestPayload}
      {...omit(props, 'children')}
    >
      {({tableData, ...rest}) => {
        return props.children({
          hasMeasurements: tableData?.measurements ?? null,
          ...rest,
        });
      }}
    </GenericDiscoverQuery>
  );
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/performance/vitals/vitalsCardsDiscoverQuery.tsx" line="56">

---

Lastly, the `VitalsCardsDiscoverQuery` function in `vitalsCardsDiscoverQuery.tsx` makes a request to the `events-vitals` endpoint. This endpoint fetches data related to specific web vitals, which is then used to populate the vitals cards in the UI.

```tsx
function VitalsCardsDiscoverQuery(props: Props) {
  return (
    <GenericDiscoverQuery<VitalsData, VitalsProps>
      getRequestPayload={getRequestPayload}
      route="events-vitals"
      {...props}
    >
      {({tableData, ...rest}) => {
        return props.children({vitalsData: tableData, ...rest});
      }}
    </GenericDiscoverQuery>
  );
}

export default withApi(VitalsCardsDiscoverQuery);
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
