---
title: Basic concepts of Sentry Data Export
---
Sentry Data Export is a feature in the Sentry application that allows users to export their data for further analysis. It is implemented in the `src/sentry/data_export` directory. The data export process is handled by different modules, including endpoints for handling API requests (`data_export.py` and `data_export_details.py`), tasks for processing the data (`tasks.py`), and utility functions (`utils.py`). The data export feature supports different types of queries, such as 'Issues-by-Tag' and 'Discover', as defined in `base.py`. The data export process is designed to handle potential errors and exceptions, ensuring the robustness of the feature.

<SwmSnippet path="/src/sentry/data_export/endpoints/data_export.py" line="110">

---

# Sentry Data Export Endpoints

The `DataExportEndpoint` class in this file defines the POST endpoint for creating a new asynchronous file export task. The endpoint validates the data export payload, checks for existing data export tasks with the same payload, and creates a new task if none exist. The task is then enqueued for processing, and the user is emailed upon completion.

```python
class DataExportEndpoint(OrganizationEndpoint, EnvironmentMixin):
    permission_classes = (OrganizationDataExportPermission,)

    def post(self, request: Request, organization) -> Response:
        """
        Create a new asynchronous file export task, and
        email user upon completion,
        """
        # The data export feature is only available alongside `discover-query`.
        # So to export issue tags, they must have have `discover-query`
        if not features.has("organizations:discover-query", organization):
            return Response(status=404)

        # Get environment_id and limit if available
        try:
            environment_id = self._get_environment_id_from_request(request, organization.id)
        except Environment.DoesNotExist as error:
            return Response(error, status=400)
        limit = request.data.get("limit")

        # Validate the data export payload
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/data_export/endpoints/data_export_details.py" line="17">

---

The `DataExportDetailsEndpoint` class in this file defines the GET endpoint for retrieving information about a temporary file record. The endpoint checks for the existence of the requested data export, verifies the user's permissions to view the data, and either returns the serialized data export or initiates a file download.

```python
class DataExportDetailsEndpoint(OrganizationEndpoint):
    permission_classes = (OrganizationDataExportPermission,)

    def get(self, request: Request, organization: Organization, data_export_id: str) -> Response:
        """
        Retrieve information about the temporary file record.
        Used to populate page emailed to the user.
        """

        if not features.has("organizations:discover-query", organization):
            return Response(status=404)

        try:
            data_export = ExportedData.objects.get(id=data_export_id, organization=organization)
        except ExportedData.DoesNotExist:
            return Response(status=404)
        # Check data export permissions
        if data_export.query_info.get("project"):
            project_ids = map(int, data_export.query_info.get("project", []))
            projects = Project.objects.filter(organization=organization, id__in=project_ids)
            if any(p for p in projects if not request.access.has_project_access(p)):
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
