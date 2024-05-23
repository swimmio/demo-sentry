---
title: Execution Process of top_events_timeseries Function
---
This document will cover the process of executing the `top_events_timeseries` function in the `src/sentry/snuba/discover.py` file. We'll cover:

1. The initial function call and its purpose
2. The subsequent function calls and their roles in the process
3. The final steps and their impact on the overall process.

```mermaid
graph TD;
subgraph src/sentry
  top_events_timeseries:::mainFlowStyle --> get_timeseries_snuba_filter
end
subgraph src/sentry/search/events
  top_events_timeseries:::mainFlowStyle --> run_query
end
subgraph src/sentry/utils
  top_events_timeseries:::mainFlowStyle --> bulk_snql_query
end
subgraph src/sentry/utils
  top_events_timeseries:::mainFlowStyle --> raw_query
end
subgraph src/sentry
  top_events_timeseries:::mainFlowStyle --> query
end
subgraph src/sentry/search/events
  get_timeseries_snuba_filter --> resolve_field_list
end
subgraph src/sentry/search/events
  resolve_field_list --> resolve_field
end
subgraph src/sentry/utils
  run_query --> raw_snql_query
end
subgraph src/sentry/utils
  raw_snql_query --> _apply_cache_and_build_results
end
subgraph src/sentry/utils
  raw_snql_query --> incr
end
subgraph src/sentry/utils
  bulk_snql_query --> _apply_cache_and_build_results
end
subgraph src/sentry/utils
  bulk_snql_query --> incr
end
subgraph src/sentry/utils
  _apply_cache_and_build_results --> incr
end
subgraph src/sentry/utils
  _apply_cache_and_build_results --> _bulk_snuba_query
end
subgraph src/sentry/api
  incr --> put
end
subgraph src/sentry/utils
  incr --> _start
end
subgraph src/sentry/utils
  raw_query --> bulk_raw_query
end
subgraph src/sentry/utils
  bulk_raw_query --> _apply_cache_and_build_results
end
subgraph src/sentry/search/events
  query:::mainFlowStyle --> run_query
end
subgraph src/sentry/utils
  query:::mainFlowStyle --> raw_query
end
subgraph src/sentry
  query:::mainFlowStyle --> transform_results
end
subgraph src/sentry
  query:::mainFlowStyle --> prepare_discover_query
end
subgraph src/sentry
  transform_results --> transform_meta
end
subgraph src/sentry
  transform_results --> transform_data
end
subgraph src/sentry/search/events
  transform_meta --> get_json_meta_type
end
subgraph src/sentry
  transform_data --> zerofill
end
subgraph src/sentry/search/events
  prepare_discover_query:::mainFlowStyle --> resolve_field_list
end
subgraph src/sentry/search/events
  prepare_discover_query:::mainFlowStyle --> get_filter
end
subgraph src/sentry/search/events
  resolve_field --> resolve_function
end
subgraph src/sentry/api
  get_filter:::mainFlowStyle --> parse_search_query
end
subgraph src/sentry/search/events
  get_filter:::mainFlowStyle --> column
end
subgraph src/sentry/search/events
  get_filter:::mainFlowStyle --> convert_search_boolean_to_snuba_query
end
subgraph src/sentry/search/events
  parse_search_query --> column
end
subgraph src/sentry/search/events
  column --> resolve_column_name
end
subgraph src/sentry/search/events
  resolve_column_name --> resolve_column
end
subgraph src/sentry/search/events
  convert_search_boolean_to_snuba_query:::mainFlowStyle --> convert_snuba_condition_to_function
end
subgraph src/sentry/search/events
  convert_snuba_condition_to_function:::mainFlowStyle --> format_search_filter
end
subgraph src/sentry/models
  format_search_filter:::mainFlowStyle --> by_qualified_short_id_bulk
end
subgraph src/sentry/search/utils.py
  format_search_filter:::mainFlowStyle --> parse_release
end
subgraph src/sentry
  by_qualified_short_id_bulk --> list
end
subgraph src/sentry/utils
  list --> echo
end
subgraph src/sentry/search/utils.py
  parse_release:::mainFlowStyle --> get_latest_release
end
subgraph src/sentry
  get_latest_release:::mainFlowStyle --> list
end
subgraph src/sentry/search/utils.py
  get_latest_release:::mainFlowStyle --> _run_latest_release_query
end
subgraph src/sentry/models
  get_latest_release:::mainFlowStyle --> follows_semver_versioning_scheme
end
subgraph src/sentry
  echo --> write
end
  follows_semver_versioning_scheme:::mainFlowStyle --> ...

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

<SwmSnippet path="/src/sentry/snuba/discover.py" line="430">

---

# Initial Function Call: top_events_timeseries

The `top_events_timeseries` function is the starting point of the process. It takes selected_columns, query, and params as arguments. It prepares the Snuba filter for the timeseries based on the provided arguments. If the Snuba filter doesn't have a start and end, it raises an InvalidSearchQuery error. The function also handles the calculation of project level thresholds for the new apdex, user_misery, and count_miserable calculations.

```python
def get_timeseries_snuba_filter(selected_columns, query, params):
    snuba_filter = get_filter(query, params)
    if not snuba_filter.start and not snuba_filter.end:
        raise InvalidSearchQuery("Cannot get timeseries result without a start and end.")

    equations, columns = categorize_columns(selected_columns)

    if len(equations) > 0:
        resolved_equations, updated_columns, _ = resolve_equation_list(
            equations, columns, aggregates_only=True, auto_add=True
        )
    else:
        resolved_equations = []
        updated_columns = columns

    # For the new apdex, we need to add project threshold config as a selected
    # column which means the group by for the time series won't work.
    # As a temporary solution, we will calculate the mean of all the project
    # level thresholds in the request and use the legacy apdex, user_misery
    # or count_miserable calculation.
    # TODO(snql): Alias the project_threshold_config column so it doesn't
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/search/events/builder.py" line="1135">

---

# Subsequent Function Calls

The `run_query` function is called within `top_events_timeseries`. It executes the SnQL query and returns the result.

```python
        )

    def run_query(self, referrer: str, use_cache: bool = False) -> Any:
        return raw_snql_query(self.get_snql_query(), referrer, use_cache)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/utils/snuba.py" line="716">

---

The `bulk_raw_query` function is called within `top_events_timeseries`. It prepares the query parameters and applies cache to build the results.

```python
def bulk_raw_query(
    snuba_param_list: Sequence[SnubaQueryParams],
    referrer: Optional[str] = None,
    use_cache: Optional[bool] = False,
) -> ResultSet:
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/utils/snuba.py" line="725">

---

# Final Steps

The `_apply_cache_and_build_results` function is called within `bulk_raw_query`. It applies cache to the Snuba query results and builds the final results. If the cache is used, it checks for cached results and queries only if the cached result is not found. The results are then sorted and returned.

```python
def _apply_cache_and_build_results(
    snuba_param_list: Sequence[SnubaQueryBody],
    referrer: Optional[str] = None,
    use_cache: Optional[bool] = False,
) -> ResultSet:
    headers = {}
    if referrer:
        headers["referer"] = referrer

    # Store the original position of the query so that we can maintain the order
    query_param_list = list(enumerate(snuba_param_list))

    results = []

    if use_cache:
        cache_keys = [get_cache_key(query_params[0]) for _, query_params in query_param_list]
        cache_data = cache.get_many(cache_keys)
        to_query: List[Tuple[int, SnubaQueryBody, Optional[str]]] = []
        for (query_pos, query_params), cache_key in zip(query_param_list, cache_keys):
            cached_result = cache_data.get(cache_key)
            metric_tags = {"referrer": referrer} if referrer else None
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
