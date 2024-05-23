---
title: Release Creation Process
---
This document will cover the process of creating and saving a new release in the Sentry application. The steps include:

1. Posting a new release
2. Getting the release details
3. Setting commits and references for the release
4. Getting the projects associated with the release
5. Saving the release details.

```mermaid
graph TD;
subgraph src/sentry/api/endpoints
  post:::mainFlowStyle --> get
end
subgraph src/sentry/models
  post:::mainFlowStyle --> set_commits
end
subgraph src/sentry/models
  post:::mainFlowStyle --> set_refs
end
subgraph src/sentry/api
  post:::mainFlowStyle --> get_projects
end
subgraph src/sentry/api/endpoints
  post:::mainFlowStyle --> save
end
subgraph src/sentry/api/endpoints
  get --> _filter_releases_by_query
end
subgraph src/sentry/api
  get --> paginate
end
subgraph src/sentry/api/endpoints
  get --> debounce_update_release_health_data
end
subgraph src/sentry/api/endpoints
  _filter_releases_by_query --> get
end
subgraph src/sentry/api
  _filter_releases_by_query --> parse_search_query
end
subgraph src/sentry/api
  paginate --> get_result
end
subgraph src/sentry/api/endpoints
  debounce_update_release_health_data --> get
end
subgraph src/sentry
  debounce_update_release_health_data --> get_many_from_cache
end
subgraph src/sentry/models
  set_commits --> get_or_create
end
subgraph src/sentry/models
  get_or_create --> _get_or_create_impl
end
subgraph src/sentry/utils
  get_or_create --> timer
end
subgraph src/sentry/models
  set_refs --> get_or_create
end
subgraph src/sentry/api
  get_projects --> _get_projects_by_id
end
subgraph src/sentry
  _get_projects_by_id --> list
end
subgraph src/sentry
  _get_projects_by_id --> set_tag
end
subgraph src/sentry/models
  save:::mainFlowStyle --> save_avatar
end
subgraph src/sentry/models
  save_avatar:::mainFlowStyle --> putfile
end
subgraph src/sentry/models
  putfile:::mainFlowStyle --> from_file
end
subgraph src/sentry/utils
  from_file:::mainFlowStyle --> timing
end
subgraph src/sentry/models
  from_file:::mainFlowStyle --> _get_size_and_checksum
end
subgraph src/sentry
  timing --> exception
end
subgraph src/sentry/utils
  exception --> captureException
end
subgraph src/sentry/models
  _get_size_and_checksum:::mainFlowStyle --> read
end
subgraph src/sentry/models
  read:::mainFlowStyle --> _nextidx
end
subgraph src/sentry/models
  _nextidx:::mainFlowStyle --> getfile
end
subgraph src/sentry/models
  getfile:::mainFlowStyle --> open
end
  open:::mainFlowStyle --> ...

 classDef mainFlowStyle color:#000000,fill:#7CB9F4
  classDef rootsStyle color:#000000,fill:#00FFF4
```

<SwmSnippet path="/src/sentry/api/endpoints/organization_releases.py" line="220">

---

# Posting a new release

The `post` function in `organization_releases.py` is the entry point for creating a new release. It takes in the request and organization details, and returns a list of releases for the given organization.

````````````````````````````````python
    def get(self, request: Request, organization) -> Response:
        """
        List an Organization's Releases
        ```````````````````````````````
        Return a list of releases for a given organization.

        :pparam string organization_slug: the organization short name
        :qparam string query: this parameter can be used to create a
                              "starts with" filter for the version.
        """
        query = request.GET.get("query")
        with_health = request.GET.get("health") == "1"
        with_adoption_stages = request.GET.get("adoptionStages") == "1"
        status_filter = request.GET.get("status", "open")
        flatten = request.GET.get("flatten") == "1"
        sort = request.GET.get("sort") or "date"
        health_stat = request.GET.get("healthStat") or "sessions"
        summary_stats_period = request.GET.get("summaryStatsPeriod") or "14d"
        health_stats_period = request.GET.get("healthStatsPeriod") or ("24h" if with_health else "")
        if summary_stats_period not in STATS_PERIODS:
            raise ParseError(detail=get_stats_period_detail("summaryStatsPeriod", STATS_PERIODS))
````````````````````````````````

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/api/endpoints/organization_details.py" line="82">

---

# Saving the release details

The `save` function in `organization_details.py` is responsible for saving the details of the release, including the avatar associated with the release.

```python
    (
        "attachmentsRole",
        "sentry:attachments_role",
        str,
        org_serializers.ATTACHMENTS_ROLE_DEFAULT,
    ),
    (
        "debugFilesRole",
        "sentry:debug_files_role",
        str,
        org_serializers.DEBUG_FILES_ROLE_DEFAULT,
    ),
    (
        "eventsMemberAdmin",
        "sentry:events_member_admin",
        bool,
        org_serializers.EVENTS_MEMBER_ADMIN_DEFAULT,
    ),
    (
        "alertsMemberWrite",
        "sentry:alerts_member_write",
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
