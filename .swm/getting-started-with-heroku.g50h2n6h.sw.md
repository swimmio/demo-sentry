---
title: Getting started with Heroku
---
Heroku is a cloud platform that lets companies build, deliver, monitor, and scale apps. In the context of the `demo-sentry` repository, Heroku is used as a plugin. The `HerokuPlugin` class in `src/sentry_plugins/heroku/plugin.py` is used to integrate Heroku release tracking into the Sentry application. This allows Sentry to track when new versions of an application are released on Heroku, providing valuable information for debugging and issue tracking. The `HerokuApiClient` class in `src/sentry_plugins/heroku/client.py` is used to interact with the Heroku API, enabling the plugin to fetch data about releases.

<SwmSnippet path="/src/sentry_plugins/heroku/plugin.py" line="28">

---

# Heroku Endpoints in Sentry

The `handle` method in the `HerokuReleaseHook` class is an endpoint that handles incoming requests from Heroku. It extracts information from the request, such as the user and version details, and finishes the release. The `set_refs` method sets references for the release and creates a deploy associated with the release via the `ReleaseDeploysEndpoint`. The endpoint URL is constructed using the organization slug and release version. The `post` method of the `HerokuApiClient` is then used to send a POST request to this endpoint.

```python
    def handle(self, request: Request) -> Response:
        email = None
        if "user" in request.POST:
            email = request.POST["user"]
        elif "actor" in request.POST:
            email = request.POST["actor"].get("email")
        try:
            user = User.objects.get(
                email__iexact=email, sentry_orgmember_set__organization__project=self.project
            )
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            user = None
            logger.info(
                "owner.missing",
                extra={
                    "organization_id": self.project.organization_id,
                    "project_id": self.project.id,
                    "email": email,
                },
            )
        self.finish_release(
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/heroku/plugin.py" line="109">

---

# Heroku Plugin Configuration

The `configure` method in the `HerokuPlugin` class is used to configure the plugin for a specific project. The `get_config` method returns the configuration options for the plugin, which include the repository and deploy environment. These options are used to configure the Heroku plugin for a specific project in Sentry.

```python
    def configure(self, project, request):
        return react_plugin_config(self, project, request)

    def can_enable_for_projects(self):
        return True

    def can_configure_for_project(self, project):
        return True

    def has_project_conf(self):
        return True

    def get_conf_key(self):
        return "heroku"

    def get_config(self, project, **kwargs):
        repo_list = list(Repository.objects.filter(organization_id=project.organization_id))
        if not ProjectOption.objects.get_value(project=project, key="heroku:repository"):
            choices = [("", "select a repo")]
        else:
            choices = []
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
