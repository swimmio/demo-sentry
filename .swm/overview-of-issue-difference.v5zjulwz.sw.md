---
title: Overview of Issue Difference
---
# Issue Difference

The Issue Difference, as implemented in the `IssueDiff` component, is a feature that allows developers to compare two issues in Sentry. It fetches data for two issues, referred to as the base issue and the target issue, and displays the differences between them. The differences can be viewed in two modes: 'Diff stack trace and message' and 'Diff grouping information'. The 'Diff stack trace and message' mode shows differences in the stack trace and message of the two issues, while the 'Diff grouping information' mode shows differences in the grouping information of the two issues. The `IssueDiff` component uses the `SplitDiff` component to display these differences.

<SwmSnippet path="/static/app/components/issueDiff/index.tsx" line="45">

---

# IssueDiff Component

The `IssueDiff` component is a React component that is responsible for displaying the differences between two issues. It fetches the data for the base and target issues using the `fetchEventData` function and displays the differences between them. The component also has a `toggleDiffMode` function that toggles between displaying the differences in the stack trace and message and the grouping information.

```tsx
class IssueDiff extends Component<Props, State> {
  static defaultProps: DefaultProps = defaultProps;

  state: State = {
    loading: true,
    groupingDiff: false,
    baseEvent: [],
    targetEvent: [],

    // `SplitDiffAsync` is an async-loaded component
    // This will eventually contain a reference to the exported component from `./splitDiff`
    SplitDiffAsync: undefined,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const {baseIssueId, targetIssueId, baseEventId, targetEventId} = this.props;

```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/issueDiff/index.tsx" line="92">

---

# Fetching Event Data

The `fetchEventData` function is used to fetch the data for an issue from the API. It uses the `api.requestPromise` function to make requests to the API. If the `eventId` is 'latest', it fetches the latest event for the issue from the `/issues/{issueId}/events/latest/` endpoint. If the `groupingDiff` state is true, it fetches the grouping information for the event from the `/projects/{orgId}/{project.slug}/events/{paramEventId}/grouping-info/` endpoint. Otherwise, it fetches the event data from the `/projects/{orgId}/{project.slug}/events/{paramEventId}/` endpoint.

```tsx
  fetchEventData = async (issueId: string, eventId: string) => {
    const {orgId, project, api} = this.props;
    const {groupingDiff} = this.state;

    let paramEventId = eventId;

    if (eventId === 'latest') {
      const event = await api.requestPromise(`/issues/${issueId}/events/latest/`);
      paramEventId = event.eventID;
    }

    if (groupingDiff) {
      const groupingInfo = await api.requestPromise(
        `/projects/${orgId}/${project.slug}/events/${paramEventId}/grouping-info/`
      );
      return renderGroupingInfo(groupingInfo);
    }

    const event = await api.requestPromise(
      `/projects/${orgId}/${project.slug}/events/${paramEventId}/`
    );
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
