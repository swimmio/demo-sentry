---
title: What is Metrics
---
Metrics in the context of the demo-sentry repository refer to the data points that are collected and used for monitoring and analyzing the system's performance. The `MetricsContext` in `static/app/utils/metrics/metricsContext.tsx` is a React context that provides a way to pass this metrics data through the component tree without having to pass props down manually at every level. It is used in various parts of the codebase, such as `metricsProvider.tsx` and `useMetricsContext.tsx`. The `MetricsContextValue` interface defines the shape of the data in the context, including `metas` and `tags`. The `metricsRequest.tsx` file contains logic for making requests to fetch metrics data, with various parameters like `project`, `query`, `interval`, and `end`.

<SwmSnippet path="/static/app/utils/metrics/metricsRequest.tsx" line="74">

---

# MetricsRequest Component

The `MetricsRequest` component is a React component that fetches metrics data from an API endpoint. It uses the `api` prop, which is an instance of the `Client` type, to make the request. The component maintains its own state, which includes the loading status, error status, and the response data. The `fetchData` method is responsible for making the request and updating the state accordingly. This component is likely used in parts of the application where metrics data needs to be fetched and displayed.

```tsx
class MetricsRequest extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    includePrevious: false,
    includeSeriesData: false,
    includeTabularData: false,
    isDisabled: false,
  };

  state: State = {
    reloading: false,
    errored: false,
    error: null,
    response: null,
    responsePrevious: null,
    pageLinks: null,
  };

  componentDidMount() {
    this.fetchData();
  }

```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/metrics/metricsProvider.tsx" line="46">

---

# MetricsProvider Component

The `MetricsProvider` component is a React context provider that fetches metrics metadata and tags from API endpoints. It uses the `api` instance from the `useApi` hook to make the requests. The fetched data is then provided to child components via the `MetricsContext`. This component is likely used in parts of the application where metrics metadata and tags need to be available to child components.

```tsx
export function MetricsProvider({
  children,
  fields,
  organization,
  projects,
  skipLoad = false,
}: MetricsProviderProps) {
  const api = useApi();
  const [state, setState] = useState({metas: {}, tags: {}});

  useEffect(() => {
    if (skipLoad) {
      return undefined;
    }

    let shouldCancelRequest = false;

    fetchMetricMetas(api, organization, projects)
      .then(response => {
        if (shouldCancelRequest) {
          return;
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
