---
title: Introduction to Organization Stats
---
Organization Stats in the demo-sentry repository refers to the statistical data related to an organization's usage of the Sentry application. This includes data on errors, transactions, attachments, and other relevant metrics. The data is fetched and displayed in various components within the `organizationStats` directory. The `organization` object is used extensively across these components to fetch and display data specific to the organization. For instance, it's used to fetch usage statistics per minute, project-specific usage statistics, and team insights. The `orgStats` member is used to store the fetched data. The `dataCategoryName` member is used to specify the category of data being fetched (errors, transactions, attachments).

<SwmSnippet path="/static/app/views/organizationStats/teamInsights/teamStability.tsx" line="57">

---

# Organization Stats Endpoints

The `getEndpoints` method defines two endpoints: 'periodSessions' and 'weekSessions'. Both endpoints use the same base URL `/organizations/${organization.slug}/sessions/`, but with different query parameters. The query parameters are determined by the properties of the `TeamStability` component, such as `start`, `end`, `period`, `utc`, and `projects`. The endpoints return session data for the specified organization, within the specified time range, for the specified projects.

```tsx
  getEndpoints() {
    const {organization, start, end, period, utc, projects} = this.props;

    const projectsWithSessions = projects.filter(project => project.hasSessions);

    if (projectsWithSessions.length === 0) {
      return [];
    }

    const datetime = {start, end, period, utc};
    const commonQuery = {
      environment: [],
      project: projectsWithSessions.map(p => p.id),
      field: 'sum(session)',
      groupBy: ['session.status', 'project'],
      interval: '1d',
    };

    const endpoints: ReturnType<AsyncComponent['getEndpoints']> = [
      [
        'periodSessions',
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/organizationStats/types.tsx" line="15">

---

# Organization Stats Data Types

The `UsageSeries` and `UsageStat` types define the structure of the data returned by the 'Organization Stats' endpoints. `UsageSeries` includes the start and end times of the series, while `UsageStat` includes the number of accepted, dropped, and filtered events, as well as the total number of events for a specific date.

```tsx
export type UsageSeries = SeriesApi & {
  end: string;
  start: string;
};

export type UsageStat = {
  accepted: number;
  date: string;
  dropped: {
    total: number;
    other?: number;
  };
  filtered: number;
  total: number;
};
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
