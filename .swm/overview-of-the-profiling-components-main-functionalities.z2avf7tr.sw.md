---
title: Overview of the Profiling components main functionalities
---
This document will cover the main functionalities provided by the Profiling component in the Sentry repository. We'll cover:

1. The structure of the Profiling component
2. The main functionalities of the Profiling component.

<SwmSnippet path="/static/app/types/jsSelfProfiling.d.ts" line="1">

---

# Structure of the Profiling Component

The Profiling component is defined in the `jsSelfProfiling.d.ts` file. It includes several types and an interface. The types include `Marker`, `Sample`, `Stack`, `Frame`, `Trace`, and `BufferFullCallback`. The interface `Profiler` includes properties such as `sampleInterval`, `stopped`, `new`, `addEventListener`, and `stop`.

```typescript
// Type definitions for https://wicg.github.io/js-self-profiling/
declare namespace JSSelfProfiling {
  type Marker = 'script' | 'gc' | 'style' | 'layout' | 'paint' | 'other';

  type Sample = {
    timestamp: number;
    stackId?: number;
    marker?: Marker;
  };

  type Stack = {
    frameId: number;
    parentId?: number;
  };

  type Frame = {
    name: string;
    resourceId?: number;
    line?: number;
    column?: number;
  };
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
