---
title: Introduction to Phabricator
---
Phabricator is a suite of tools designed to assist in software development. It includes applications for code review, repository hosting, bug tracking, and project management. In the context of the `demo-sentry` repository, Phabricator is integrated into the Sentry issue tracking system. This integration allows developers to create tickets in Phabricator directly from Sentry issues, and also link existing Sentry issues to Phabricator tickets. This enhances productivity by providing a seamless transition from identifying a bug in Sentry to tracking its resolution in Phabricator.

<SwmSnippet path="/src/sentry_plugins/phabricator/plugin.py" line="36">

---

# Phabricator Plugin

The `PhabricatorPlugin` class is the main entry point of the plugin. It defines the plugin's description, slug, title, and configuration key. It also outlines the features provided by the plugin, such as creating and linking Sentry issues to Phabricator tickets.

```python
class PhabricatorPlugin(CorePluginMixin, IssuePlugin2):
    description = DESCRIPTION

    slug = "phabricator"
    title = "Phabricator"
    conf_title = "Phabricator"
    conf_key = "phabricator"
    required_field = "host"
    feature_descriptions = [
        FeatureDescription(
            """
            Create and link Sentry issue groups directly to a Phabricator ticket in any of your
            projects, providing a quick way to jump from a Sentry bug to tracked ticket!
            """,
            IntegrationFeatures.ISSUE_BASIC,
        ),
        FeatureDescription(
            """
            Link Sentry issues to existing Phabricator tickets.
            """,
            IntegrationFeatures.ISSUE_BASIC,
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/phabricator/plugin.py" line="60">

---

# Phabricator API Interaction

The `get_api` method is used to interact with the Phabricator API. It creates an instance of the `Phabricator` class with the necessary credentials and host information. This instance is then used to make requests to the Phabricator API.

```python
    def get_api(self, project):
        return phabricator.Phabricator(
            host=urljoin(self.get_option("host", project), "api/"),
            username=self.get_option("username", project),
            certificate=self.get_option("certificate", project),
            token=self.get_option("token", project),
        )
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/phabricator/plugin.py" line="222">

---

# Issue Creation and Linking

The `create_issue` method is used to create a new issue in Phabricator from a Sentry issue. It uses the `maniphest.createtask` endpoint of the Phabricator API to create the issue.

```python
    def create_issue(self, request: Request, group, form_data, **kwargs):
        api = self.get_api(group.project)
        try:
            data = api.maniphest.createtask(
                title=str(form_data["title"]),
                description=str(form_data["description"]),
                ownerPHID=form_data.get("assignee"),
                projectPHIDs=form_data.get("tags"),
            )
        except phabricator.APIError as e:
            raise PluginError(f"{e.code} {e}")
        except HTTPException as e:
            raise PluginError("Unable to reach Phabricator host: %s" % e)

        return data["id"]
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry_plugins/phabricator/plugin.py" line="238">

---

# Issue Linking

The `link_issue` method is used to link an existing Phabricator issue to a Sentry issue. It uses the `maniphest.search` endpoint of the Phabricator API to find the issue and then links it to the Sentry issue.

```python
    def link_issue(self, request: Request, group, form_data, **kwargs):
        api = self.get_api(group.project)

        try:
            results = api.maniphest.search(constraints={"phids": [form_data["issue_id"]]})
        except Exception as e:
            raise self.raise_error(e)

        task = results["data"][0]

        comment = form_data.get("comment")
        if comment:
            try:
                api.maniphest.edit(
                    objectIdentifier=form_data["issue_id"],
                    transactions=[{"type": "comment", "value": comment}],
                )
            except Exception as e:
                raise self.raise_error(e)

        return {
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
