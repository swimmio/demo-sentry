---
title: API
---
This document will cover the details of the API provided by the demo-sentry repository. We'll cover:

1. Overview of the API and its offerings
2. Details on where to find the list of endpoints
3. Explanation of API documentation tools available in the repo

<SwmSnippet path="/api-docs/openapi.json" line="1">

---

# Overview of the API

The API is defined in the `openapi.json` file. It provides a variety of endpoints for different entities like Teams, Organizations, Projects, Events, Releases, Integration, and SCIM. Each entity has its own set of endpoints for performing various operations.

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "API Reference",
    "description": "Sentry Public API",
    "termsOfService": "http://sentry.io/terms/",
    "contact": {
      "email": "partners@sentry.io"
    },
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version": "v0"
  },
  "servers": [
    {
      "url": "https://sentry.io/"
    }
  ],
  "tags": [
```

---

</SwmSnippet>

<SwmSnippet path="/api-docs/openapi.json" line="89">

---

# List of Endpoints

The list of endpoints for each entity is defined under the `paths` section in the `openapi.json` file. Each endpoint is associated with a specific operation like GET, POST, PUT, DELETE, etc.

```json
  "paths": {
    "/api/0/organizations/{organization_slug}/teams/": {
      "$ref": "paths/teams/index.json"
    },
    "/api/0/teams/{organization_slug}/{team_slug}/": {
      "$ref": "paths/teams/by-slug.json"
    },
    "/api/0/teams/{organization_slug}/{team_slug}/projects/": {
      "$ref": "paths/teams/projects.json"
    },
    "/api/0/teams/{organization_slug}/{team_slug}/stats/": {
      "$ref": "paths/teams/stats.json"
    },
    "/api/0/organizations/": {
      "$ref": "paths/organizations/index.json"
    },
    "/api/0/organizations/{organization_slug}/eventids/{event_id}/": {
      "$ref": "paths/organizations/event-id-lookup.json"
    },
    "/api/0/organizations/{organization_slug}/": {
      "$ref": "paths/organizations/details.json"
```

---

</SwmSnippet>

# API Documentation Tools

The API documentation is automatically generated using `api-docs/generate.py`. This ensures that the documentation is always up-to-date with the API definition.

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
