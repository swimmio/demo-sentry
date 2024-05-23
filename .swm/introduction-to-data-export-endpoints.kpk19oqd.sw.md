---
title: Introduction to Data Export Endpoints
---
Data Export Endpoints in the Sentry application are responsible for handling the creation and retrieval of asynchronous file export tasks. The `DataExportEndpoint` class is used to create a new asynchronous file export task. It validates the data export payload, checks for existing requests with the same payload and organization, and if none are found, it creates a new one and triggers an asynchronous task to assemble the download. The `DataExportDetailsEndpoint` class is used to retrieve information about the temporary file record. It checks data export permissions, and if the user has the necessary permissions, it provides the option to download the file if it exists. Both classes use the `OrganizationDataExportPermission` class to handle permissions.

<SwmSnippet path="/src/sentry/data_export/endpoints/data_export.py" line="110">

---

# Data Export Endpoint

The `DataExportEndpoint` class defines a POST method that creates a new asynchronous file export task. It first validates the data export payload using the `DataExportQuerySerializer` class. If the payload is valid, it checks if a similar request has been made by the user. If so, it returns the latest one that is not complete. Otherwise, it creates a new `ExportedData` object and triggers the `assemble_download` task.

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

# Data Export Details Endpoint

The `DataExportDetailsEndpoint` class defines a GET method that retrieves information about the temporary file record. It first checks if the requested `ExportedData` object exists and if the user has the necessary permissions to access it. If the user has permissions and a file is ready to be downloaded, it streams the file to the user. Otherwise, it returns the serialized `ExportedData` object.

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
