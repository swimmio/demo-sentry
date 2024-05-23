---
title: Getting started with Issue List
---
The Issue List in the Sentry demo repository is a crucial feature that provides a comprehensive view of all the issues reported in a project. It is primarily located in the `static/app/views/issueList` directory. The Issue List is designed to display issues in a structured manner, allowing developers to filter, sort, and manage issues effectively. The `IssueListOverview` class in `overview.tsx` is the main component that renders the issue list. It fetches and manages the state of issues, including loading states, pagination, and error handling. The `IssueListFilters` function in `filters.tsx` is responsible for rendering and managing the filters applied to the issue list. It includes project, environment, and date filters. The `IssueListContainer` function in `container.tsx` is a wrapper component that includes the issue list and its associated components. The `actions` directory contains components and utilities for actions that can be performed on issues, such as resolving or reviewing them. The `noGroupsHandler` directory contains components that are displayed when there are no unresolved issues.

<SwmSnippet path="/static/app/views/issueList/overview.tsx" line="505">

---

# Fetching Issue Data

The `fetchData` function in the 'overview.tsx' file is responsible for fetching the issue data based on the provided parameters. It makes API calls to the endpoints defined in the `getGroupListEndpoint`, `getGroupCountsEndpoint`, and `getGroupStatsEndpoint` functions. The fetched data is then used to update the component's state.

```tsx
  fetchData = (fetchAllCounts = false) => {
    const {organization} = this.props;
    const query = this.getQuery();
    const hasIssueListRemovalAction = organization.features.includes(
      'issue-list-removal-action'
    );

    // TODO(Kelly): update once issue-list-removal-action feature is stable
    if (hasIssueListRemovalAction && !this.state.realtimeActive) {
      if (!this.state.actionTaken && !this.state.undo) {
        GroupStore.loadInitialData([]);
        this._streamManager.reset();

        this.setState({
          issuesLoading: true,
          queryCount: 0,
          itemsRemoved: 0,
          error: null,
        });
      }
    } else {
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/issueList/actions/index.tsx" line="22">

---

# Handling User Actions

The 'actions/index.tsx' file contains various functions that handle user actions on the issue list. For example, the `handleUpdate`, `handleDelete`, and `handleMerge` functions are used to update, delete, and merge issues, respectively. These functions make API calls to perform the desired actions and update the component's state accordingly.

```tsx
type Props = {
  allResultsVisible: boolean;
  api: Client;
  displayCount: React.ReactNode;
  displayReprocessingActions: boolean;
  groupIds: string[];
  onDelete: () => void;
  onSelectStatsPeriod: (period: string) => void;
  onSortChange: (sort: string) => void;
  organization: Organization;
  query: string;
  queryCount: number;
  selection: PageFilters;
  sort: string;
  statsPeriod: string;
  onActionTaken?: (itemIds: string[]) => void;
  onMarkReviewed?: (itemIds: string[]) => void;
};

type State = {
  allInQuerySelected: boolean;
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
