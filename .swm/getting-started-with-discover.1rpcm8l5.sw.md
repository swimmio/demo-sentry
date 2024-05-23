---
title: Getting started with Discover
---
# Discover

Discover is a utility in the Sentry application that allows users to explore their data in a flexible and efficient manner. It is implemented in the `static/app/utils/discover` directory. The main component is the `_GenericDiscoverQuery` class in `genericDiscoverQuery.tsx`, which is a generic component for discover queries. This class manages the state of the query, including loading status, error handling, and data fetching. It uses the `fetchData` method to retrieve data based on the provided props, and the `getPayload` method to construct the payload for the API request. The `DiscoverQuery` function in `discoverQuery.tsx` uses this generic class to create a specific discover query. The `DiscoverQueryProps` type defines the properties that can be passed to this function. The Discover utility is used throughout the application to fetch and display data in a flexible and efficient manner.

<SwmSnippet path="/static/app/utils/discover/discoverQuery.tsx" line="38">

---

# DiscoverQuery Component

The `DiscoverQuery` component is a React component that uses the `GenericDiscoverQuery` to fetch data from the Discover endpoint. It takes in `DiscoverQueryPropsWithThresholds` and `GenericChildrenProps` as props. The `shouldRefetchData` function is used to determine if the data needs to be refetched based on changes in the transaction name, threshold, or threshold metric.

```tsx
function shouldRefetchData(
  prevProps: DiscoverQueryPropsWithThresholds,
  nextProps: DiscoverQueryPropsWithThresholds
) {
  return (
    prevProps.transactionName !== nextProps.transactionName ||
    prevProps.transactionThreshold !== nextProps.transactionThreshold ||
    prevProps.transactionThresholdMetric !== nextProps.transactionThresholdMetric
  );
}

function DiscoverQuery(props: DiscoverQueryComponentProps) {
  return (
    <GenericDiscoverQuery<TableData, DiscoverQueryPropsWithThresholds>
      route="eventsv2"
      shouldRefetchData={shouldRefetchData}
      {...props}
    />
  );
}

```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/discover/genericDiscoverQuery.tsx" line="142">

---

# GenericDiscoverQuery Component

The `GenericDiscoverQuery` component is a more generalized component for making queries to the Discover endpoint. It takes in a variety of props to customize the query, handle the response, and manage the loading state. The `fetchData` function is used to make the actual API request. The `getPayload` function is used to construct the payload for the API request based on the provided props.

```tsx
class _GenericDiscoverQuery<T, P> extends React.Component<Props<T, P>, State<T>> {
  state: State<T> = {
    isLoading: true,
    tableFetchID: undefined,
    error: null,

    tableData: null,
    pageLinks: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props<T, P>) {
    // Reload data if the payload changes
    const refetchCondition = this._shouldRefetchData(prevProps);

    // or if we've moved from an invalid view state to a valid one,
    const eventViewValidation =
      prevProps.eventView.isValid() === false && this.props.eventView.isValid();
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
