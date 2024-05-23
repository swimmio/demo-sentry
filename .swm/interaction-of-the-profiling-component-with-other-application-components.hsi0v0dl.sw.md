---
title: Interaction of the Profiling component with other application components
---
This document will cover the interaction of the Profiling component with other application components or modules. We'll cover:

1. The structure and functionality of the Profiling component
2. How the Profiling component interacts with other components

<SwmSnippet path="/static/app/types/profiling.d.ts" line="1">

---

# Structure and Functionality of the Profiling Component

The Profiling component is defined in this file. It includes properties such as `endValue`, `startValue`, `name`, `unit`, `weights`, `samples`, and `type`. These properties are used to store and manage profiling data.

```typescript
declare namespace Profiling {
  interface RawProfileBase {
    endValue: number;
    startValue: number;
    name: string;
    unit: string;
    spans?: Span[];
  }

  // Android traces follow this format
  interface EventedProfile extends RawProfileBase {
    events: ReadonlyArray<Event>;
    type: 'evented';
  }

  // iOS traces follow this format
  interface SampledProfile extends RawProfileBase {
    weights: number[];
    samples: number[][];
    type: 'sampled';
  }
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/profiling/landing/profilingTable.tsx" line="10">

---

# Interaction of the Profiling Component with Other Components

The Profiling component interacts with other components through the `ProfilingTableProps` interface. This interface includes properties such as `error`, `isLoading`, `location`, and `traces`, which are used to manage the state and behavior of the Profiling component.

```tsx
interface ProfilingTableProps {
  error: string | null;
  isLoading: boolean;
  location: Location;
  traces: Trace[];
}
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
