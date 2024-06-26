---
title: Event Handling in Sentry
---
This document will cover the process of event handling in the Sentry application, which includes:

1. Saving the event
2. Running background grouping
3. Saving aggregate
4. Saving transaction events
5. Saving attachments.

## Where is this flow used?

The flow starts with the function `save`. It is called from multiple entry points as represented in the following diagram: (Note - these are only some of the entry points of this flow)

```mermaid
graph TD;
subgraph src/sentry/incidents
  update:::rootsStyle --> update_alert_rule
end
subgraph src/sentry/incidents
  update_alert_rule --> delete
end
subgraph src/sentry/incidents
  delete --> delete_alert_rule
end
subgraph src/sentry
  delete_alert_rule --> create_audit_entry_from_user
end
subgraph src/sentry
  create_audit_entry_from_user --> create_org_delete_log
end
subgraph src/sentry
  create_org_delete_log --> complete_delete_log
end
subgraph src/sentry
  complete_delete_log --> save:::mainFlowStyle
end
subgraph src/sentry/integrations/slack
  handle:::rootsStyle --> send_slack_response
end
subgraph src/sentry/integrations/slack
  send_slack_response --> post
end
subgraph src/sentry/integrations/slack
  post --> handle_member_approval
end
subgraph src/sentry
  handle_member_approval --> approve_member_invitation
end
subgraph src/sentry
  approve_member_invitation --> create_audit_entry_from_user
end
subgraph src/sentry/incidents
  create:::rootsStyle --> _handle_triggers
end
subgraph src/sentry/incidents
  _handle_triggers --> delete_alert_rule_trigger
end
subgraph src/sentry/incidents
  delete_alert_rule_trigger --> delete
end
subgraph src/sentry/integrations/slack
  send_incident_alert_notification:::rootsStyle --> post
end
subgraph src/sentry/integrations/slack
  handle:::rootsStyle --> send_message
end
subgraph src/sentry/integrations/slack
  send_message --> post
end

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

## The flow itself

```mermaid
graph TD;
subgraph src/sentry
  save:::mainFlowStyle --> _run_background_grouping
end
subgraph src/sentry
  save:::mainFlowStyle --> _save_aggregate
end
subgraph src/sentry
  save:::mainFlowStyle --> _calculate_event_grouping
end
subgraph src/sentry
  save:::mainFlowStyle --> save_attachments
end
subgraph src/sentry
  save:::mainFlowStyle --> save_transaction_events
end
subgraph src/sentry
  _run_background_grouping --> _calculate_background_grouping
end
subgraph src/sentry/grouping
  _run_background_grouping --> get_config_dict
end
subgraph src/sentry
  _calculate_background_grouping --> _calculate_event_grouping
end
subgraph src/sentry/grouping
  get_config_dict --> _get_enhancements
end
subgraph src/sentry
  _save_aggregate --> _process_existing_aggregate
end
subgraph src/sentry
  _save_aggregate --> killswitch_matches_context
end
subgraph src/sentry/models
  _save_aggregate --> next_short_id
end
subgraph src/sentry
  _save_aggregate --> incr
end
subgraph src/sentry
  _process_existing_aggregate --> _handle_regression
end
subgraph src/sentry
  _process_existing_aggregate --> incr
end
subgraph src/sentry
  killswitch_matches_context --> _value_matches
end
subgraph src/sentry
  killswitch_matches_context --> incr
end
subgraph src/sentry/utils
  next_short_id --> timer
end
subgraph src/sentry/models
  next_short_id --> increment
end
subgraph src/sentry
  incr --> apply_async
end
subgraph src/sentry
  _calculate_event_grouping --> normalize_stacktraces_for_grouping
end
subgraph src/sentry/grouping
  _calculate_event_grouping --> get_grouping_config_dict_for_project
end
subgraph src/sentry/grouping
  _calculate_event_grouping --> apply_server_fingerprinting
end
subgraph src/sentry/grouping
  _calculate_event_grouping --> get_fingerprinting_config_for_project
end
subgraph src/sentry/grouping
  normalize_stacktraces_for_grouping --> apply_modifications_to_frame
end
subgraph src/sentry/grouping
  get_grouping_config_dict_for_project --> get_config_dict
end
subgraph src/sentry/grouping
  apply_server_fingerprinting --> get_fingerprint_values_for_event
end
subgraph src/sentry/grouping
  get_fingerprinting_config_for_project --> from_config_string
end
subgraph src/sentry
  save_attachments --> save_attachment
end
subgraph src/sentry/utils
  save_attachment --> track_outcome
end
subgraph src/sentry/models
  save_attachment --> putfile
end
subgraph src/sentry
  save_transaction_events:::mainFlowStyle --> _track_outcome_accepted_many
end
subgraph src/sentry/db/models
  save_transaction_events:::mainFlowStyle --> get_many_from_cache
end
subgraph src/sentry
  save_transaction_events:::mainFlowStyle --> _get_or_create_release_many
end
subgraph src/sentry
  save_transaction_events:::mainFlowStyle --> _get_event_user_many
end
subgraph src/sentry
  save_transaction_events:::mainFlowStyle --> _eventstream_insert_many
end
subgraph src/sentry/utils
  _track_outcome_accepted_many --> track_outcome
end
subgraph src/sentry/utils
  track_outcome --> incr
end
subgraph src/sentry/utils
  track_outcome --> publish
end
subgraph src/sentry/db/models
  get_many_from_cache --> __post_save
end
subgraph src/sentry/utils
  get_many_from_cache --> get_many
end
subgraph src/sentry/db/models
  __post_save --> delete
end
subgraph src/sentry/db/models
  __post_save --> __get_lookup_cache_key
end
subgraph src/sentry/utils
  get_many --> __decode_row
end
subgraph src/sentry/models
  _get_or_create_release_many --> add_dist
end
subgraph src/sentry/models
  add_dist --> get_or_create
end
subgraph src/sentry
  _get_event_user_many --> _get_event_user
end
subgraph src/sentry/utils
  _get_event_user --> timer
end
subgraph src/sentry
  _get_event_user --> _get_event_user_impl
end
subgraph src/sentry
  _eventstream_insert_many:::mainFlowStyle --> incr
end
subgraph src/sentry
  _eventstream_insert_many:::mainFlowStyle --> get_primary_hash
end
subgraph src/sentry/utils
  apply_async --> timer
end
subgraph src/sentry
  get_primary_hash:::mainFlowStyle --> get_hashes
end
subgraph src/sentry
  get_hashes:::mainFlowStyle --> get_sorted_grouping_variants
end
subgraph src/sentry
  get_sorted_grouping_variants:::mainFlowStyle --> get_grouping_variants
end
subgraph src/sentry
  get_grouping_variants:::mainFlowStyle --> get_grouping_config
end
subgraph src/sentry/grouping
  get_grouping_variants:::mainFlowStyle --> get_grouping_variants_for_event
end
subgraph src/sentry/grouping
  get_grouping_config --> get_grouping_config_dict_for_event_data
end
subgraph src/sentry/grouping
  get_grouping_config_dict_for_event_data --> get_grouping_config_dict_for_project
end
subgraph src/sentry/grouping
  get_grouping_variants_for_event:::mainFlowStyle --> _get_calculated_grouping_variants_for_event
end
subgraph src/sentry/grouping
  _get_calculated_grouping_variants_for_event:::mainFlowStyle --> get_grouping_component_variants
end
  get_grouping_component_variants:::mainFlowStyle --> ...

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

<SwmSnippet path="/src/sentry/event_manager.py" line="582">

---

# Saving the event

The function `save` is the main entry point for event processing. It calls several other functions to perform tasks such as running background grouping, saving aggregate, saving transaction events, and saving attachments.

```python
def _run_background_grouping(project, job):
    """Optionally run a fraction of events with a third grouping config
    This can be helpful to measure its performance impact.
    This does not affect actual grouping.
    """
    try:
        sample_rate = options.get("store.background-grouping-sample-rate")
        if sample_rate and random.random() <= sample_rate:
            config = BackgroundGroupingConfigLoader().get_config_dict(project)
            if config["id"]:
                copied_event = copy.deepcopy(job["event"])
                _calculate_background_grouping(project, copied_event, config)
    except Exception:
        sentry_sdk.capture_exception()
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/event_manager.py" line="577">

---

# Running background grouping

The function `_run_background_grouping` is used to optionally run a fraction of events with a third grouping config. This does not affect actual grouping but can be helpful to measure its performance impact.

```python
@metrics.wraps("event_manager.background_grouping")
def _calculate_background_grouping(project, event, config):
    return _calculate_event_grouping(project, event, config)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/event_manager.py" line="1384">

---

# Saving aggregate

The function `_process_existing_aggregate` is used to process the existing aggregate of the group. It updates the group's attributes such as last seen, message, level, and first seen based on the event data.

```python
def _process_existing_aggregate(group, event, data, release):
    date = max(event.datetime, group.last_seen)
    extra = {"last_seen": date, "score": ScoreClause(group), "data": data["data"]}
    if event.search_message and event.search_message != group.message:
        extra["message"] = event.search_message
    if group.level != data["level"]:
        extra["level"] = data["level"]
    if group.culprit != data["culprit"]:
        extra["culprit"] = data["culprit"]
    if group.first_seen > event.datetime:
        extra["first_seen"] = event.datetime

    is_regression = _handle_regression(group, event, release)

    group.last_seen = extra["last_seen"]

    update_kwargs = {"times_seen": 1}

    buffer.incr(Group, update_kwargs, {"id": group.id}, extra)

```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/event_manager.py" line="895">

---

# Saving transaction events

The function `save_transaction_events` is used to track the outcome of many jobs. It iterates over the jobs and for each job, it tracks the outcome as accepted.

```python
def _track_outcome_accepted_many(jobs):
    for job in jobs:
        event = job["event"]

        track_outcome(
            org_id=event.project.organization_id,
            project_id=job["project_id"],
            key_id=job["key_id"],
            outcome=Outcome.ACCEPTED,
            reason=None,
            timestamp=to_datetime(job["start_time"]),
            event_id=event.event_id,
            category=job["category"],
        )
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/event_manager.py" line="1588">

---

# Saving attachments

The function `save_attachments` is used to persist a cached event attachments into the file store. It emits one outcome, either ACCEPTED on success or INVALID(missing_chunks) if retrieving the attachment data fails.

```python
def save_attachment(
    cache_key, attachment, project, event_id, key_id=None, group_id=None, start_time=None
):
    """
    Persists a cached event attachments into the file store.

    Emits one outcome, either ACCEPTED on success or INVALID(missing_chunks) if
    retrieving the attachment data fails.

    :param cache_key:  The cache key at which the attachment is stored for
                       debugging purposes.
    :param attachment: The ``CachedAttachment`` instance to store.
    :param project:    The project model that this attachment belongs to.
    :param event_id:   Identifier of the event that this attachment belongs to.
                       The event does not have to be stored yet.
    :param key_id:     Optional identifier of the DSN that was used to ingest
                       the attachment.
    :param group_id:   Optional group identifier for the event. May be empty if
                       the event has not been stored yet, or if it is not
                       grouped.
    :param start_time: UNIX Timestamp (float) when the attachment was ingested.
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
