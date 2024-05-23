---
title: Overview of Heroku
---
Heroku is a cloud platform that lets companies build, deliver, monitor, and scale apps. In the context of the `demo-sentry` repository, Heroku is used as a plugin for Sentry. The `HerokuPlugin` class in `src/sentry_plugins/heroku/plugin.py` is used to integrate Heroku release tracking into Sentry. This allows Sentry to track when new versions of an application are released on Heroku, providing valuable context for debugging issues. The `HerokuApiClient` class in `src/sentry_plugins/heroku/client.py` is used to interact with the Heroku API, enabling the plugin to fetch data about releases.

<SwmSnippet path="/src/sentry_plugins/heroku/plugin.py" line="18">

---

# HerokuReleaseHook Class

The `HerokuReleaseHook` class is a key part of the Heroku plugin. It defines the `handle` method which is the endpoint that receives the request from Heroku when a new release is made. This method extracts the user information from the request, and then calls the `finish_release` method to finalize the release. The `set_refs` method is used to set the references for the release, and the `get_client` method is used to get an instance of the Heroku API client.

```python
class HerokuReleaseHook(ReleaseHook):
    def get_auth(self):
        try:
            return ApiKey(organization=self.project.organization, scope_list=["project:write"])
        except ApiKey.DoesNotExist:
            return None

    def get_client(self):
        return HerokuApiClient()

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
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/heroku/plugin.py" line="93">

---

# HerokuPlugin Class

The `HerokuPlugin` class is the main class for the Heroku plugin. It defines the configuration for the plugin, including the author, title, description, and required fields. It also defines the `get_config` method which is used to get the configuration for the plugin, and the `get_release_hook` method which returns an instance of the `HerokuReleaseHook` class.

```python
class HerokuPlugin(CorePluginMixin, ReleaseTrackingPlugin):
    author = "Sentry Team"
    author_url = "https://github.com/getsentry"
    title = "Heroku"
    slug = "heroku"
    description = "Integrate Heroku release tracking."
    required_field = "repository"
    feature_descriptions = [
        FeatureDescription(
            """
            Integrate Heroku release tracking.
            """,
            IntegrationFeatures.DEPLOYMENT,
        )
    ]

    def configure(self, project, request):
        return react_plugin_config(self, project, request)

    def can_enable_for_projects(self):
        return True
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
