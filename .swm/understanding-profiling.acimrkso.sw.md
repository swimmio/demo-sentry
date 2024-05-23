---
title: Understanding Profiling
---
# Profiling in demo-sentry

Profiling in the demo-sentry repository is primarily handled in the `static/app/utils/profiling` directory. The `Profile` class in `profile.tsx` is a central component, representing a performance profile with properties like duration, start and end times, and associated frames. The `resolveJSSelfProfilingStack` function in `jsSelfProfiling.tsx` is a utility function used to resolve stack frames starting from the topmost frame. It walks down the stack until no more frames are found, appending the parent frame to the list. This results in a list of frames starting from the root most frame. The `forEach` method in the `Profile` class is used to iterate over the samples in the profile and perform operations on each sample. The `framesInStack` property in the `Profile` class is a set that keeps track of the frames in the current stack. Profiling in this context is used to analyze the performance of the application, identify bottlenecks and optimize the code for better performance.

<SwmSnippet path="/static/app/utils/profiling/hooks/useProfiles.tsx" line="12">

---

# Profiling Endpoints

The `fetchTraces` function is used to fetch profiling traces from the `/organizations/${organization.slug}/profiling/profiles/` endpoint. This endpoint returns a list of traces, which are essentially snapshots of the call stack at a particular point in time. The function takes several parameters including the API client, a query string, a cursor for pagination, the organization, and the selection filters.

```tsx
function fetchTraces(
  api: Client,
  query: string | undefined,
  cursor: string | undefined,
  organization: Organization,
  selection: PageFilters
): Promise<[Trace[], string | undefined, ResponseMeta | undefined]> {
  return api.requestPromise(`/organizations/${organization.slug}/profiling/profiles/`, {
    method: 'GET',
    includeAllArgs: true,
    query: {
      cursor,
      query,
      project: selection.projects,
      environment: selection.environments,
      ...normalizeDateTimeParams(selection.datetime),
    },
  });
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/utils/profiling/hooks/useProfileFilters.tsx" line="44">

---

The `fetchProfileFilters` function fetches profile filters from the `/organizations/${organization.slug}/profiling/filters/` endpoint. These filters can be used to narrow down the profiling data to specific projects, environments, or time ranges. The function takes the API client, the organization, and the selection filters as parameters.

```tsx
function fetchProfileFilters(
  api: Client,
  organization: Organization,
  selection: PageFilters
): Promise<[Tag]> {
  return api.requestPromise(`/organizations/${organization.slug}/profiling/filters/`, {
    method: 'GET',
    query: {
      project: selection.projects,
      environment: selection.environments,
      ...normalizeDateTimeParams(selection.datetime),
    },
  });
}
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
