---
id: 2acnz
name: How to add analytics events
file_version: 1.0.2
app_version: 0.8.2-0
file_blobs:
  src/sentry/analytics/events/team_created.py: 63a7a606376b937eea55305328054c41203ff3aa
  src/sentry/receivers/features.py: 8f0a3bdf08f59ab0d60840072beb9133d9b1b575
  src/sentry/api/endpoints/auth_index.py: be9659d93f86247e9d24669c690b24e5e5a0106c
---

This guide steps you through instrumenting your code with Sentry's 3rd-party analytics infrastructure.

## Big Query

Send events to Big Query and run queries in [Redash](https://redash.getsentry.net/).

<br/>

Create a new file in `📄 src/sentry/analytics/events`, using the key in snake case as the filename. For example - `📄 src/sentry/analytics/events/team_created.py` for `TeamCreatedEvent`[<sup id="Z7MHnT">↓</sup>](#f-Z7MHnT) .

In this file, you will need to `register`[<sup id="Z26WpiN">↓</sup>](#f-Z26WpiN) the event with its `attributes`[<sup id="1pdewQ">↓</sup>](#f-1pdewQ) (for validation):
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/analytics/events/team_created.py
```python
⬜ 1      from sentry import analytics
⬜ 2      
⬜ 3      
🟩 4      class TeamCreatedEvent(analytics.Event):
🟩 5          type = "team.created"
🟩 6      
🟩 7          attributes = (
🟩 8              analytics.Attribute("user_id", required=False),
🟩 9              analytics.Attribute("default_user_id"),
🟩 10             analytics.Attribute("organization_id"),
🟩 11             analytics.Attribute("team_id"),
🟩 12         )
🟩 13     
🟩 14     
🟩 15     analytics.register(TeamCreatedEvent)
⬜ 16     
```

<br/>

Now in the code that you want instrumented, use the `analytics.record`[<sup id="Z1Vylhf">↓</sup>](#f-Z1Vylhf) function with the registered key (in this case, `team.created`[<sup id="ORgDQ">↓</sup>](#f-ORgDQ) ) .
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/receivers/features.py
```python
🟩 545        analytics.record(
🟩 546            "team.created",
🟩 547            user_id=user_id,
🟩 548            default_user_id=default_user_id,
🟩 549            organization_id=organization.id,
🟩 550            team_id=team.id,
🟩 551        )
```

<br/>

## Metrics

Track aggregrate stats with [Metrics](/services/metrics/). For example, this can be used to track aggregate response codes for an endpoint.

Import the `metrics`[<sup id="1pV5t0">↓</sup>](#f-1pV5t0) library and use the `metrics.incr`[<sup id="1EBtB9">↓</sup>](#f-1EBtB9) function. The key needs to be unique.

If you don't put a `sample_rate`[<sup id="Z2uxtGe">↓</sup>](#f-Z2uxtGe) , you get 1 in 10 events. If the service is expected to have low traffic, we can start with a sample rate 1.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/api/endpoints/auth_index.py
```python
⬜ 206            try:
⬜ 207                # Must use the httprequest object instead of request
⬜ 208                auth.login(request._request, request.user)
🟩 209                metrics.incr(
🟩 210                    "sudo_modal.success",
🟩 211                    sample_rate=1.0,
🟩 212                )
⬜ 213            except auth.AuthUserPasswordExpired:
⬜ 214                metrics.incr(
⬜ 215                    "sudo_modal.failure",
```

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-Z1Vylhf">analytics.record</span>[^](#Z1Vylhf) - "src/sentry/receivers/features.py" L545
```python
    analytics.record(
```

<span id="f-1pdewQ">attributes</span>[^](#1pdewQ) - "src/sentry/analytics/events/team_created.py" L7
```python
    attributes = (
```

<span id="f-1pV5t0">metrics</span>[^](#1pV5t0) - "src/sentry/api/endpoints/auth_index.py" L209
```python
            metrics.incr(
```

<span id="f-1EBtB9">metrics.incr</span>[^](#1EBtB9) - "src/sentry/api/endpoints/auth_index.py" L209
```python
            metrics.incr(
```

<span id="f-Z26WpiN">register</span>[^](#Z26WpiN) - "src/sentry/analytics/events/team_created.py" L15
```python
analytics.register(TeamCreatedEvent)
```

<span id="f-Z2uxtGe">sample_rate</span>[^](#Z2uxtGe) - "src/sentry/api/endpoints/auth_index.py" L211
```python
                sample_rate=1.0,
```

<span id="f-ORgDQ">team.created</span>[^](#ORgDQ) - "src/sentry/receivers/features.py" L546
```python
        "team.created",
```

<span id="f-Z7MHnT">TeamCreatedEvent</span>[^](#Z7MHnT) - "src/sentry/analytics/events/team_created.py" L4
```python
class TeamCreatedEvent(analytics.Event):
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc2VudHJ5JTNBJTNBc3dpbW1pbw==/docs/2acnz).