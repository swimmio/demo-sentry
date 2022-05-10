---
id: d8v18
name: The flow of an API call
file_version: 1.0.2
app_version: 0.8.4-0
file_blobs:
  static/app/views/dataExport/dataDownload.tsx: 1d5a818c7040d31c720f1aa24093d1fdb84a4ae7
  static/app/routes.tsx: ea6f39f35818df39dae826d476d068f9e8b212d9
  src/sentry/api/urls.py: a0aa15624804393ce3b8a9463c224fa3019afe97
  src/sentry/data_export/endpoints/data_export_details.py: b22da8e3f1b06cbdaf440acf6fe4405acc98a515
  tests/js/spec/views/dataExport/dataDownload.spec.jsx: 58f81b48e8fb754f48f33ea19295282253ca5dea
  tests/sentry/data_export/endpoints/test_data_export_details.py: ec31127c2ab1d24cc3f8f625870a8d84e26e8d0f
---

We have API endpoints that are exposed to our users. Sometimes, we use them internally.

In this walkthrough we will follow the example of a button allowing the user to download sentry data as CSV:

<br/>

<div align="center"><img src="https://firebasestorage.googleapis.com/v0/b/swimmio-content/o/repositories%2FZ2l0aHViJTNBJTNBc2VudHJ5JTNBJTNBc3dpbW1pbw%3D%3D%2F8dfe0b92-7e7e-4338-b1ff-3738ac5503db.png?alt=media&token=a80f09a7-7c13-4dd5-903b-7c764e9b9a65" style="width:'100%'"/></div>

<br/>

Starting with the frontend, we can see that the `Button`[<sup id="1etPl3">↓</sup>](#f-1etPl3) calls the api endpoint `data-export`[<sup id="2kDqDj">↓</sup>](#f-2kDqDj).
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/views/dataExport/dataDownload.tsx
```tsx
⬜ 194            </Header>
⬜ 195            <Body>
⬜ 196              <p>{t("See, that wasn't so bad. Your data is all ready for download.")}</p>
🟩 197              <Button
🟩 198                priority="primary"
🟩 199                icon={<IconDownload />}
🟩 200                href={`/api/0/organizations/${orgId}/data-export/${dataExportId}/?download=true`}
🟩 201              >
🟩 202                {t('Download CSV')}
🟩 203              </Button>
⬜ 204              <p>
⬜ 205                {t("That link won't last forever — it expires:")}
⬜ 206                <br />
```

<br/>

The route to this view is defined in `📄 static/app/routes.tsx` :
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/routes.tsx
```tsx
⬜ 193            componentPromise={() => import('sentry/views/organizationCreate')}
⬜ 194            component={SafeLazyLoad}
⬜ 195          />
🟩 196          <Route
🟩 197            path="/organizations/:orgId/data-export/:dataExportId"
🟩 198            componentPromise={() => import('sentry/views/dataExport/dataDownload')}
🟩 199            component={SafeLazyLoad}
🟩 200          />
⬜ 201          <Route
⬜ 202            path="/organizations/:orgId/disabled-member/"
⬜ 203            componentPromise={() => import('sentry/views/disabledMember')}
```

<br/>

This API call should now be handled by an endpoint. For that, the `url`[<sup id="Z5Bup9">↓</sup>](#f-Z5Bup9) is registered here. The snippet below links the relevant `url`[<sup id="Z5Bup9">↓</sup>](#f-Z5Bup9) with the endpoint `DataExportDetailsEndpoint`[<sup id="Z1lxMWQ">↓</sup>](#f-Z1lxMWQ) :
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/api/urls.py
```python
⬜ 853                    # Data Export
⬜ 854                    url(
⬜ 855                        r"^(?P<organization_slug>[^\/]+)/data-export/$",
⬜ 856                        DataExportEndpoint.as_view(),
⬜ 857                        name="sentry-api-0-organization-data-export",
⬜ 858                    ),
🟩 859                    url(
🟩 860                        r"^(?P<organization_slug>[^\/]+)/data-export/(?P<data_export_id>[^\/]+)/$",
🟩 861                        DataExportDetailsEndpoint.as_view(),
🟩 862                        name="sentry-api-0-organization-data-export-details",
🟩 863                    ),
```

<br/>

This endpoint is defined here, and can handle `GET`[<sup id="14QWtH">↓</sup>](#f-14QWtH) requests - with the `get`[<sup id="1QqruT">↓</sup>](#f-1QqruT) handler:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/data_export/endpoints/data_export_details.py
```python
🟩 17     class DataExportDetailsEndpoint(OrganizationEndpoint):
🟩 18         permission_classes = (OrganizationDataExportPermission,)
🟩 19     
🟩 20         def get(self, request: Request, organization: Organization, data_export_id: str) -> Response:
```

<br/>

Recall that on the frontend we passed the parameter `download`[<sup id="1IC52a">↓</sup>](#f-1IC52a) :
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/views/dataExport/dataDownload.tsx
```tsx
⬜ 197              <Button
⬜ 198                priority="primary"
⬜ 199                icon={<IconDownload />}
🟩 200                href={`/api/0/organizations/${orgId}/data-export/${dataExportId}/?download=true`}
⬜ 201              >
⬜ 202                {t('Download CSV')}
⬜ 203              </Button>
```

<br/>

Here the endpoint parses this param and continues accordingly.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/data_export/endpoints/data_export_details.py
```python
⬜ 41             # Ignore the download parameter unless we have a file to stream
🟩 42             if request.GET.get("download") is not None and data_export._get_file() is not None:
🟩 43                 return self.download(data_export)
⬜ 44             return Response(serialize(data_export, request.user))
```

<br/>

# Testing

## Frontend

<br/>

Note that we use `MockApiClient.addMockResponse`[<sup id="Z1BHn7c">↓</sup>](#f-Z1BHn7c) to mock API calls. This function returns a jest mock that represents `request`[<sup id="1iyUif">↓</sup>](#f-1iyUif) calls.  
For our case, we need to add an `organization`[<sup id="ZAwQtR">↓</sup>](#f-ZAwQtR), so we use `TestStubs.Organization`[<sup id="23pCIP">↓</sup>](#f-23pCIP) to generate a stub one.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 tests/js/spec/views/dataExport/dataDownload.spec.jsx
```javascript
⬜ 4      import DataDownload, {DownloadStatus} from 'sentry/views/dataExport/dataDownload';
⬜ 5      
⬜ 6      describe('DataDownload', function () {
🟩 7        beforeEach(MockApiClient.clearMockResponses);
🟩 8        const dateExpired = new Date();
🟩 9        const organization = TestStubs.Organization();
🟩 10       const mockRouteParams = {
🟩 11         orgId: organization.slug,
🟩 12         dataExportId: 721,
🟩 13       };
🟩 14       const getDataExportDetails = (body, statusCode = 200) =>
🟩 15         MockApiClient.addMockResponse({
🟩 16           url: `/organizations/${mockRouteParams.orgId}/data-export/${mockRouteParams.dataExportId}/`,
🟩 17           body,
🟩 18           statusCode,
🟩 19         });
```

<br/>

We can then test the the UI, like so.  
Note that we use `mockRouteParams`[<sup id="Z204lpQ">↓</sup>](#f-Z204lpQ) on `mountWithTheme`[<sup id="Z1YTDDF">↓</sup>](#f-Z1YTDDF), that is, the `mockRouteParams`[<sup id="ELJfJ">↓</sup>](#f-ELJfJ) that were initiated in the previous snippet. We use `mountWithTheme`[<sup id="Z1YTDDF">↓</sup>](#f-Z1YTDDF) here so that `DataDownload`[<sup id="1YG1Wz">↓</sup>](#f-1YG1Wz) gets wrapped with a `<ThemeProvider>`.

Here we validate that given a `Valid`[<sup id="8hgnV">↓</sup>](#f-8hgnV) status, the button appears as expected.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 tests/js/spec/views/dataExport/dataDownload.spec.jsx
```javascript
⬜ 63         );
⬜ 64       });
⬜ 65     
🟩 66       it("should render the 'Valid' view when appropriate", function () {
🟩 67         const status = DownloadStatus.Valid;
🟩 68         getDataExportDetails({dateExpired, status});
🟩 69         const wrapper = mountWithTheme(<DataDownload params={mockRouteParams} />);
🟩 70         expect(wrapper.state('download')).toEqual({dateExpired, status});
🟩 71         expect(wrapper.find('Header').text()).toBe('All done.');
🟩 72         const buttonWrapper = wrapper.find('a[aria-label="Download CSV"]');
🟩 73         expect(buttonWrapper.text()).toBe('Download CSV');
🟩 74         expect(buttonWrapper.prop('href')).toBe(
🟩 75           `/api/0/organizations/${mockRouteParams.orgId}/data-export/${mockRouteParams.dataExportId}/?download=true`
🟩 76         );
🟩 77         expect(wrapper.find('DateTime').prop('date')).toEqual(new Date(dateExpired));
🟩 78       });
⬜ 79     
⬜ 80       it('should render the Open in Discover button when needed', function () {
⬜ 81         const status = DownloadStatus.Valid;
```

<br/>

## Endpoint

<br/>

To test the Endpoint itself, we create a class that inherits from `APITestCase`[<sup id="MRYuz">↓</sup>](#f-MRYuz) :
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 tests/sentry/data_export/endpoints/test_data_export_details.py
```python
⬜ 11     from sentry.testutils import APITestCase
⬜ 12     
⬜ 13     
🟩 14     class DataExportDetailsTest(APITestCase):
⬜ 15         endpoint = "sentry-api-0-organization-data-export-details"
```

<br/>

And then we can test the actual data being returned
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 tests/sentry/data_export/endpoints/test_data_export_details.py
```python
⬜ 17         def setUp(self):
⬜ 18             self.user = self.create_user()
⬜ 19             self.organization = self.create_organization(owner=self.user)
⬜ 20             self.login_as(user=self.user)
⬜ 21             self.data_export = ExportedData.objects.create(
⬜ 22                 user=self.user, organization=self.organization, query_type=0, query_info={"env": "test"}
⬜ 23             )
⬜ 24     
🟩 25         def test_content(self):
🟩 26             with self.feature("organizations:discover-query"):
🟩 27                 response = self.get_valid_response(self.organization.slug, self.data_export.id)
🟩 28             assert response.data["id"] == self.data_export.id
🟩 29             assert response.data["user"] == {
🟩 30                 "id": str(self.user.id),
🟩 31                 "email": self.user.email,
🟩 32                 "username": self.user.username,
🟩 33             }
🟩 34             assert response.data["dateCreated"] == self.data_export.date_added
🟩 35             assert response.data["query"] == {
🟩 36                 "type": ExportQueryType.as_str(self.data_export.query_type),
🟩 37                 "info": self.data_export.query_info,
🟩 38             }
```

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-MRYuz">APITestCase</span>[^](#MRYuz) - "tests/sentry/data_export/endpoints/test_data_export_details.py" L14
```python
class DataExportDetailsTest(APITestCase):
```

<span id="f-1etPl3">Button</span>[^](#1etPl3) - "static/app/views/dataExport/dataDownload.tsx" L197
```tsx
          <Button
```

<span id="f-2kDqDj">data-export</span>[^](#2kDqDj) - "static/app/views/dataExport/dataDownload.tsx" L200
```tsx
            href={`/api/0/organizations/${orgId}/data-export/${dataExportId}/?download=true`}
```

<span id="f-1YG1Wz">DataDownload</span>[^](#1YG1Wz) - "tests/js/spec/views/dataExport/dataDownload.spec.jsx" L69
```javascript
    const wrapper = mountWithTheme(<DataDownload params={mockRouteParams} />);
```

<span id="f-Z1lxMWQ">DataExportDetailsEndpoint</span>[^](#Z1lxMWQ) - "src/sentry/api/urls.py" L861
```python
                    DataExportDetailsEndpoint.as_view(),
```

<span id="f-1IC52a">download</span>[^](#1IC52a) - "static/app/views/dataExport/dataDownload.tsx" L200
```tsx
            href={`/api/0/organizations/${orgId}/data-export/${dataExportId}/?download=true`}
```

<span id="f-1QqruT">get</span>[^](#1QqruT) - "src/sentry/data_export/endpoints/data_export_details.py" L20
```python
    def get(self, request: Request, organization: Organization, data_export_id: str) -> Response:
```

<span id="f-14QWtH">GET</span>[^](#14QWtH) - "src/sentry/data_export/endpoints/data_export_details.py" L42
```python
        if request.GET.get("download") is not None and data_export._get_file() is not None:
```

<span id="f-Z1BHn7c">MockApiClient.addMockResponse</span>[^](#Z1BHn7c) - "tests/js/spec/views/dataExport/dataDownload.spec.jsx" L15
```javascript
    MockApiClient.addMockResponse({
```

<span id="f-ELJfJ">mockRouteParams</span>[^](#ELJfJ) - "tests/js/spec/views/dataExport/dataDownload.spec.jsx" L10
```javascript
  const mockRouteParams = {
```

<span id="f-Z204lpQ">mockRouteParams</span>[^](#Z204lpQ) - "tests/js/spec/views/dataExport/dataDownload.spec.jsx" L69
```javascript
    const wrapper = mountWithTheme(<DataDownload params={mockRouteParams} />);
```

<span id="f-Z1YTDDF">mountWithTheme</span>[^](#Z1YTDDF) - "tests/js/spec/views/dataExport/dataDownload.spec.jsx" L69
```javascript
    const wrapper = mountWithTheme(<DataDownload params={mockRouteParams} />);
```

<span id="f-ZAwQtR">organization</span>[^](#ZAwQtR) - "tests/js/spec/views/dataExport/dataDownload.spec.jsx" L9
```javascript
  const organization = TestStubs.Organization();
```

<span id="f-1iyUif">request</span>[^](#1iyUif) - "src/sentry/data_export/endpoints/data_export_details.py" L20
```python
    def get(self, request: Request, organization: Organization, data_export_id: str) -> Response:
```

<span id="f-23pCIP">TestStubs.Organization</span>[^](#23pCIP) - "tests/js/spec/views/dataExport/dataDownload.spec.jsx" L9
```javascript
  const organization = TestStubs.Organization();
```

<span id="f-Z5Bup9">url</span>[^](#Z5Bup9) - "src/sentry/api/urls.py" L859
```python
                url(
```

<span id="f-8hgnV">Valid</span>[^](#8hgnV) - "tests/js/spec/views/dataExport/dataDownload.spec.jsx" L67
```javascript
    const status = DownloadStatus.Valid;
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc2VudHJ5JTNBJTNBc3dpbW1pbw==/docs/d8v18).