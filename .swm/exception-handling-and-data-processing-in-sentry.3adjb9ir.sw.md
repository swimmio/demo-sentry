---
title: Exception Handling and Data Processing in Sentry
---
This document will cover the process of handling exceptions and data processing in Sentry, which includes:

1. Raising and capturing exceptions
2. Configuring scope and setting tags
3. Trimming and encoding data

## Where is this flow used?

The flow starts with the function `timing`. It is called from multiple entry points as represented in the following diagram:

```mermaid
graph TD;
subgraph src/sentry/incidents
  delete:::rootsStyle --> delete_alert_rule
end
subgraph src/sentry/incidents/endpoints
  delete_alert_rule --> delete
end
subgraph src/sentry/incidents/endpoints
  delete --> _verify_user_has_permission
end
subgraph src/sentry/incidents
  _verify_user_has_permission --> resolve
end
subgraph src/sentry/incidents
  resolve --> build_handler
end
subgraph src/sentry
  build_handler --> incr
end
subgraph src/sentry
  incr --> apply_async
end
subgraph src/sentry/utils
  apply_async --> timer
end
subgraph src/sentry/utils
  timer --> timing:::mainFlowStyle
end
subgraph src/sentry/api/endpoints
  get_event_stats:::rootsStyle --> resolve_function
end
subgraph src/sentry/api/endpoints
  resolve_function --> get
end
subgraph src/sentry/api/endpoints
  get --> get_snuba_params
end
subgraph src/sentry/api/endpoints
  get_snuba_params --> get
end
subgraph src/sentry/api/endpoints
  get --> query_suspect_span_groups
end
subgraph src/sentry/utils
  query_suspect_span_groups --> raw_snql_query
end
subgraph src/sentry/utils
  raw_snql_query --> _apply_cache_and_build_results
end
subgraph src/sentry/utils
  _apply_cache_and_build_results --> incr
end
subgraph src/sentry/api/client.py
  incr --> put
end
subgraph src/sentry/api/client.py
  put --> request
end
subgraph src/sentry/incidents
  request --> resolve
end

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

## The flow itself

```mermaid
graph TD;
subgraph src/sentry
  timing:::mainFlowStyle --> exception
end
subgraph src/sentry/utils
  exception:::mainFlowStyle --> captureException
end
subgraph src/sentry/utils
  captureException:::mainFlowStyle --> _kwargs_into_scope
end
subgraph src/sentry
  _kwargs_into_scope:::mainFlowStyle --> set_tag
end
subgraph src/sentry/utils
  set_tag:::mainFlowStyle --> trim
end
subgraph src/sentry/utils
  trim:::mainFlowStyle --> dumps
end
subgraph src/sentry/utils
  dumps:::mainFlowStyle --> encode
end
subgraph src/sentry/utils
  encode:::mainFlowStyle --> iterencode
end
subgraph src/sentry/utils
  iterencode:::mainFlowStyle --> replace
end
  replace:::mainFlowStyle --> ...

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

<SwmSnippet path="/src/sentry/management/commands/send_fake_data.py" line="25">

---

# Raising and Capturing Exceptions

The function `exception` is used to simulate an exception event. It raises an exception and then captures it using the `captureException` function from the Sentry SDK.

```python
    def exception(client):
        timestamp = datetime.datetime.utcnow() - datetime.timedelta(
            seconds=random.randint(0, timestamp_max)
        )
        try:
            raise next(exceptions)
        except Exception as exc:
            email = next(emails)
            with client.configure_scope() as scope:
                scope.user = {"id": email, "email": email}
                scope.logger = next(loggers)
                scope.site = "web"
                scope.date = timestamp
                return client.captureException(exc)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/utils/sdk.py" line="345">

---

# Configuring Scope and Setting Tags

The `captureException` function configures the scope of the event and sets tags using the `_kwargs_into_scope` function.

```python
    def captureException(self, exc_info=None, **kwargs):
        with sentry_sdk.push_scope() as scope:
            self._kwargs_into_scope(scope, **kwargs)
            return capture_exception(exc_info)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/utils/safe.py" line="45">

---

# Trimming and Encoding Data

The `trim` function is used to truncate a value to a maximum size. The method of truncation depends on the type of value. The trimmed value is then encoded using the `dumps` function in `src/sentry/utils/json.py`.

````python
def trim(
    value,
    max_size=settings.SENTRY_MAX_VARIABLE_SIZE,
    max_depth=6,
    object_hook=None,
    _depth=0,
    _size=0,
    **kwargs,
):
    """
    Truncates a value to ```MAX_VARIABLE_SIZE```.

    The method of truncation depends on the type of value.
    """
    options = {
        "max_depth": max_depth,
        "max_size": max_size,
        "object_hook": object_hook,
        "_depth": _depth + 1,
    }

````

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
