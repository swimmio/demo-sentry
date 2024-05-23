---
title: Issues 101
---
In the context of the `demo-sentry` repository, 'Issues' refer to the errors or exceptions that are tracked by the Sentry application. The `Issues` component, specifically the `CompactIssue` component in `static/app/components/issues/compactIssue.tsx`, is used to display a concise view of an issue. This component takes in several properties such as `id`, `organization`, `api`, `data`, and `eventId`. The `id` is a unique identifier for the issue, `organization` represents the organization the issue belongs to, `api` is the client instance used for making API calls, `data` is the issue data, and `eventId` is the id of the event associated with the issue. The `CompactIssue` component maintains a state `issue` which is initially set to the issue data passed as a prop or fetched from the `GroupStore` using the issue id. The `onUpdate` method in the `CompactIssue` component is used to update the issue data.

<SwmSnippet path="/static/app/components/issues/compactIssue.tsx" line="21">

---

# CompactIssue Component

The `CompactIssue` component is responsible for displaying individual issues in a compact format. It fetches issue data from the `GroupStore` and updates its state whenever the issue data changes. The `onUpdate` method is used to save changes to the issue, which makes a `bulkUpdate` API call. The `CompactIssueHeader` component, defined within the same file, is used to render the header of each issue, including the issue link and other metadata.

```tsx
type HeaderProps = {
  data: BaseGroup;
  organization: Organization;
  projectId: string;
  eventId?: string;
};

class CompactIssueHeader extends Component<HeaderProps> {
  render() {
    const {data, organization, projectId, eventId} = this.props;

    const basePath = `/organizations/${organization.slug}/issues/`;

    const issueLink = eventId
      ? `/organizations/${organization.slug}/projects/${projectId}/events/${eventId}/`
      : `${basePath}${data.id}/`;

    const commentColor: keyof Aliases =
      data.subscriptionDetails && data.subscriptionDetails.reason === 'mentioned'
        ? 'success'
        : 'textColor';
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/issues/groupList.tsx" line="30">

---

# GroupList Component

The `GroupList` component fetches and displays a list of issue groups. It uses the `fetchData` method to make an API request to the endpoint defined by `getGroupListEndpoint`. The `handleCursorChange` method is used for pagination, updating the browser history with the new page number and cursor. The `onGroupChange` method updates the component's state with the new list of groups whenever the `GroupStore` changes.

```tsx
const defaultProps = {
  canSelectGroups: true,
  withChart: true,
  withPagination: true,
  useFilteredStats: true,
  useTintRow: true,
  narrowGroups: false,
};

type Props = WithRouterProps & {
  api: Client;
  endpointPath: string;
  orgId: string;
  query: string;
  customStatsPeriod?: TimePeriodType;
  onFetchSuccess?: (
    groupListState: State,
    onCursor: (
      cursor: string,
      path: string,
      query: Record<string, any>,
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
