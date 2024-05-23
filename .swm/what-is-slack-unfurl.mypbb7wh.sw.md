---
title: What is Slack Unfurl
---
Slack Unfurl is a feature that allows Slack to fetch relevant information from a URL shared in a message and display it in a user-friendly format. In the context of the `demo-sentry` repository, Slack Unfurl is used to fetch and display information about issues, incidents, and discover results from the Sentry application. The `src/sentry/integrations/slack/unfurl` directory contains the implementation of this feature. It includes different handlers for different types of information (issues, incidents, discover results), each with its own specific logic to fetch and format the data. The handlers use regular expressions to match URLs and extract necessary parameters. The extracted parameters are then used to fetch data from the Sentry application and format it into a user-friendly Slack message.

<SwmSnippet path="/src/sentry/integrations/slack/unfurl/discover.py" line="90">

---

# Slack Unfurl Endpoints

The `unfurl_discover` function is the main endpoint for unfurling Discover links in Slack. It takes in data from an HTTP request, an integration instance, a list of links, and an optional user. It then processes each link, retrieves the relevant data from the Sentry application, and builds a response to be displayed in Slack. The function returns a dictionary of unfurled URLs.

```python
def unfurl_discover(
    data: HttpRequest,
    integration: Integration,
    links: List[UnfurlableUrl],
    user: Optional["User"],
) -> UnfurledUrl:
    orgs_by_slug = {org.slug: org for org in integration.organizations.all()}
    unfurls = {}

    for link in links:
        org_slug = link.args["org_slug"]
        org = orgs_by_slug.get(org_slug)

        # If the link shared is an org w/o the slack integration do not unfurl
        if not org:
            continue
        if not features.has("organizations:discover-basic", org):
            continue

        params = link.args["query"]
        query_id = params.get("id", None)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/unfurl/discover.py" line="235">

---

# Discover Query Arguments Mapping

The `map_discover_query_args` function is used to extract Discover arguments from the Discover link's query string. It takes in a URL and a mapping of arguments, unescapes the URL, parses it, and returns a dictionary of query arguments. This function is used in the `unfurl_discover` function to process the links.

```python
def map_discover_query_args(url: str, args: Mapping[str, str]) -> Mapping[str, Any]:
    """
    Extracts discover arguments from the discover link's query string
    """
    # Slack uses HTML escaped ampersands in its Event Links, when need
    # to be unescaped for QueryDict to split properly.
    url = html.unescape(url)
    parsed_url = urlparse(url)
    query = QueryDict(parsed_url.query).copy()

    # Remove some unused query keys
    query.pop("widths", None)

    return dict(**args, query=query)
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
