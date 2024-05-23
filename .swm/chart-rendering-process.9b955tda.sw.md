---
title: Chart Rendering Process
---
This document will cover the process of rendering charts in the Sentry application, which includes:

1. Initializing the BaseChartUnwrapped component
2. Configuring the Tooltip component
3. Formatting the tooltip content
4. Determining the series value
5. Checking if the series value is an array.

```mermaid
graph TD;
subgraph static/app/components/charts
  BaseChartUnwrapped:::mainFlowStyle --> Tooltip
end
subgraph static/app/components/charts
  Tooltip:::mainFlowStyle --> getFormatter
end
subgraph static/app/components/charts
  getFormatter:::mainFlowStyle --> getSeriesValue
end
subgraph static/app/components/forms/selectField.tsx
  getSeriesValue:::mainFlowStyle --> isArray
end
  isArray:::mainFlowStyle --> ...

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

<SwmSnippet path="/static/app/components/charts/baseChart.tsx" line="1">

---

# Initializing the BaseChartUnwrapped component

The `BaseChartUnwrapped` component is the starting point for rendering charts in the Sentry application. It sets up the chart configuration and initializes the Tooltip component.

```tsx
import 'echarts/lib/component/grid';
import 'echarts/lib/component/graphic';
import 'echarts/lib/component/toolbox';
import 'zrender/lib/svg/svg';

import {forwardRef, useMemo} from 'react';
import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import type {
  AxisPointerComponentOption,
  ECharts,
  EChartsOption,
  GridComponentOption,
  LegendComponentOption,
  LineSeriesOption,
  SeriesOption,
  TooltipComponentFormatterCallback,
  TooltipComponentFormatterCallbackParams,
  TooltipComponentOption,
  VisualMapComponentOption,
  XAXisComponentOption,
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/charts/components/tooltip.tsx" line="237">

---

# Configuring the Tooltip component

The `Tooltip` component is used to display information when hovering over a chart. It is configured with various options such as the background color, border width, and padding. It also uses the `getFormatter` function to format the tooltip content.

```tsx
export default function Tooltip({
  filter,
  isGroupedByDate,
  showTimeInTooltip,
  addSecondsToTimeFormat,
  formatter,
  truncate,
  utc,
  bucketSize,
  formatAxisLabel,
  valueFormatter,
  nameFormatter,
  markerFormatter,
  hideDelay,
  indentLabels,
  ...props
}: Props = {}): TooltipComponentOption {
  const theme = useTheme();

  formatter =
    formatter ||
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/charts/components/tooltip.tsx" line="104">

---

# Formatting the tooltip content

The `getFormatter` function is used to format the content of the tooltip. It takes in various options such as whether the data is grouped by date, whether to show time in the tooltip, and how to format the axis label. It returns a formatter function that is used to format the tooltip content.

```tsx
function getFormatter({
  filter,
  isGroupedByDate,
  showTimeInTooltip,
  truncate,
  formatAxisLabel,
  utc,
  bucketSize,
  valueFormatter = defaultValueFormatter,
  nameFormatter = defaultNameFormatter,
  markerFormatter = defaultMarkerFormatter,
  indentLabels = [],
  addSecondsToTimeFormat = false,
}: FormatterOptions) {
  const getFilter = (seriesParam: any) => {
    // Series do not necessarily have `data` defined, e.g. releases don't have `data`, but rather
    // has a series using strictly `markLine`s.
    // However, real series will have `data` as a tuple of (label, value) or be
    // an object with value/label keys.
    const value = getSeriesValue(seriesParam, 0);
    if (typeof filter === 'function') {
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/charts/components/tooltip.tsx" line="68">

---

# Determining the series value

The `getSeriesValue` function is used to determine the value of a series in the chart. It checks if the series data is an array or an object and returns the appropriate value.

```tsx
function getSeriesValue(series: any, offset: number) {
  if (!series.data) {
    return undefined;
  }
  if (Array.isArray(series.data)) {
    return series.data[offset];
  }
  if (Array.isArray(series.data.value)) {
    return series.data.value[offset];
  }

  return undefined;
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/forms/selectField.tsx" line="51">

---

# Checking if the series value is an array

The `isArray` function is used to check if the series value is an array. This is important for determining how to process the series value in the tooltip.

```tsx
/**
 * Required to type guard for OptionsType<T> which is a readonly Array
 */
function isArray<T>(maybe: T | OptionsType<T>): maybe is OptionsType<T> {
  return Array.isArray(maybe);
}
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
