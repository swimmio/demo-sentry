---
title: Generating a Performance Event View
---
This document will cover the process of generating a performance event view in the Sentry application. The process includes the following steps:

1. Invoking the `PerformanceContent` function
2. Calling the `generatePerformanceEventView` function
3. Calling the `generateGenericPerformanceEventView` function
4. Calling the `getCurrentTrendParameter` function
5. Calling the `getDefaultTrendParameter` function
6. Calling the `platformToPerformanceType` function.

```mermaid
graph TD;
subgraph static/app/views/performance
  PerformanceContent:::mainFlowStyle --> generatePerformanceEventView
end
subgraph static/app/views/performance
  generatePerformanceEventView:::mainFlowStyle --> generateGenericPerformanceEventView
end
subgraph static/app/views/performance
  generateGenericPerformanceEventView:::mainFlowStyle --> getCurrentTrendParameter
end
subgraph static/app/views/performance
  getCurrentTrendParameter:::mainFlowStyle --> getDefaultTrendParameter
end
subgraph static/app/views/performance
  getDefaultTrendParameter:::mainFlowStyle --> platformToPerformanceType
end
  platformToPerformanceType:::mainFlowStyle --> ...

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

<SwmSnippet path="/static/app/views/performance/content.tsx" line="1">

---

# Invoking the PerformanceContent function

The process begins with the invocation of the `PerformanceContent` function. This function is responsible for initiating the performance event view generation process.

```tsx
import {useEffect, useRef, useState} from 'react';
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/performance/data.tsx" line="739">

---

# Calling the generatePerformanceEventView function

The `PerformanceContent` function calls the `generatePerformanceEventView` function. This function generates a performance event view based on the location, projects, and whether it's a trend or not.

```tsx
export function generatePerformanceEventView(
  location: Location,
  projects: Project[],
  {isTrends = false} = {}
) {
  const eventView = generateGenericPerformanceEventView(location);

  if (isTrends) {
    return eventView;
  }

  const display = getCurrentLandingDisplay(location, projects, eventView);
  switch (display?.field) {
    case LandingDisplayField.FRONTEND_PAGELOAD:
      return generateFrontendPageloadPerformanceEventView(location);
    case LandingDisplayField.FRONTEND_OTHER:
      return generateFrontendOtherPerformanceEventView(location);
    case LandingDisplayField.BACKEND:
      return generateBackendPerformanceEventView(location);
    case LandingDisplayField.MOBILE:
      return generateMobilePerformanceEventView(location, projects, eventView);
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/performance/data.tsx" line="392">

---

# Calling the generateGenericPerformanceEventView function

The `generatePerformanceEventView` function calls the `generateGenericPerformanceEventView` function. This function generates a generic performance event view based on the location.

```tsx
function generateGenericPerformanceEventView(location: Location): EventView {
  const {query} = location;

  const fields = [
    'team_key_transaction',
    'transaction',
    'project',
    'tpm()',
    'p50()',
    'p95()',
    'failure_rate()',
    'apdex()',
    'count_unique(user)',
    'count_miserable(user)',
    'user_misery()',
  ];

  const hasStartAndEnd = query.start && query.end;
  const savedQuery: NewQuery = {
    id: undefined,
    name: t('Performance'),
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/performance/trends/utils.tsx" line="160">

---

# Calling the getCurrentTrendParameter function

The `generateGenericPerformanceEventView` function calls the `getCurrentTrendParameter` function. This function gets the current trend parameter based on the location, projects, and project IDs.

```tsx
export function getCurrentTrendParameter(
  location: Location,
  projects: Project[],
  projectIds: Readonly<number[]>
): TrendParameter {
  const trendParameterLabel = decodeScalar(location?.query?.trendParameter);
  const trendParameter = TRENDS_PARAMETERS.find(
    ({label}) => label === trendParameterLabel
  );

  if (trendParameter) {
    return trendParameter;
  }

  const defaultTrendParameter = getDefaultTrendParameter(projects, projectIds);
  return defaultTrendParameter;
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/performance/trends/utils.tsx" line="150">

---

# Calling the getDefaultTrendParameter function

The `getCurrentTrendParameter` function calls the `getDefaultTrendParameter` function if no trend parameter is found. This function gets the default trend parameter based on the projects and project IDs.

```tsx
function getDefaultTrendParameter(
  projects: Project[],
  projectIds: Readonly<number[]>
): TrendParameter {
  const performanceType = platformToPerformanceType(projects, projectIds);
  const trendParameter = performanceTypeToTrendParameterLabel(performanceType);

  return trendParameter;
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/performance/utils.tsx" line="51">

---

# Calling the platformToPerformanceType function

The `getDefaultTrendParameter` function calls the `platformToPerformanceType` function. This function determines the performance type based on the projects and project IDs.

```tsx
export function platformToPerformanceType(
  projects: (Project | ReleaseProject)[],
  projectIds: readonly number[]
) {
  if (projectIds.length === 0 || projectIds[0] === ALL_ACCESS_PROJECTS) {
    return PROJECT_PERFORMANCE_TYPE.ANY;
  }

  const selectedProjects = projects.filter(p =>
    projectIds.includes(parseInt(`${p.id}`, 10))
  );

  if (selectedProjects.length === 0 || selectedProjects.some(p => !p.platform)) {
    return PROJECT_PERFORMANCE_TYPE.ANY;
  }

  if (
    selectedProjects.every(project =>
      FRONTEND_PLATFORMS.includes(project.platform as string)
    )
  ) {
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
