---
id: 2ya4l
name: How our Slack Integration Works
file_version: 1.0.2
app_version: 0.8.7-1
file_blobs:
  src/sentry/integrations/slack/notifications.py: 3b09f3adefb35d89c5a67adda1240527cdeb2a4b
  src/sentry/integrations/slack/tasks.py: 6d8609e85d767b715d1552301d58ecd9692e46a8
  src/sentry/integrations/slack/client.py: a247435b79910b1e720661e392fae57e53d88d81
  src/sentry/integrations/slack/integration.py: 1155f6f4fb6952a856b590147791c347b791ea37
  src/sentry/conf/server.py: 0a614a0dd0643c1734a0d30dab2ec8f0fe5eacc9
---

We have a Slack integration - that allows the users to triage, resolve, and ignore Sentry issues directly from Slack.

Once you receive a Slack notification for an issue alert, you can use the "Resolve", "Ignore", or "Assign" buttons to update the Issue in Sentry.

<br/>

<div align="center"><img src="https://firebasestorage.googleapis.com/v0/b/swimmio-content/o/repositories%2FZ2l0aHViJTNBJTNBc2VudHJ5JTNBJTNBc3dpbW1pbw%3D%3D%2Fb93d6225-2a47-4d6e-97ce-f00e6697498f.png?alt=media&token=2cd75f09-d1e4-4f38-83b1-819dd0e66b1f" style="width:'50%'"/></div>

<br/>

We register our notification provider using the wrapper `register_notification_provider`[<sup id="2tFk57">↓</sup>](#f-2tFk57) , which adds `send_notification_as_slack`[<sup id="Z1BPQQt">↓</sup>](#f-Z1BPQQt) function to the global send notification registry.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/notifications.py
```python
⬜ 184        notification.record_notification_sent(recipient, ExternalProviders.SLACK)
⬜ 185    
⬜ 186    
🟩 187    @register_notification_provider(ExternalProviders.SLACK)
🟩 188    def send_notification_as_slack(
🟩 189        notification: BaseNotification,
🟩 190        recipients: Iterable[Team | User],
🟩 191        shared_context: Mapping[str, Any],
🟩 192        extra_context_by_actor_id: Mapping[int, Mapping[str, Any]] | None,
🟩 193    ) -> None:
⬜ 194        """Send an "activity" or "alert rule" notification to a Slack user or team."""
⬜ 195        with sentry_sdk.start_span(
⬜ 196            op="notification.send_slack", description="gen_channel_integration_map"
```

<br/>

Within `send_notification_as_slack`[<sup id="Z1BPQQt">↓</sup>](#f-Z1BPQQt) , we find integrations by channel, and then call `_notify_recipient`[<sup id="6EM4S">↓</sup>](#f-6EM4S) - to actually send the notification.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/notifications.py
```python
⬜ 206                        extra_context_by_actor_id,
⬜ 207                    )
⬜ 208    
🟩 209                for channel, integration in integrations_by_channel.items():
🟩 210                    _notify_recipient(
🟩 211                        notification=notification,
🟩 212                        recipient=recipient,
🟩 213                        attachments=attachments,
🟩 214                        channel=channel,
🟩 215                        integration=integration,
🟩 216                    )
⬜ 217    
⬜ 218        metrics.incr(
⬜ 219            f"{notification.metrics_key}.notifications.sent",
```

<br/>

Within `_notify_recipient`[<sup id="Ns1D4">↓</sup>](#f-Ns1D4) , we initialize the data, and then the actual sending is done by calling`post_message`[<sup id="2bCIQu">↓</sup>](#f-2bCIQu)
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/notifications.py
```python
⬜ 141    def _notify_recipient(
⬜ 142        notification: BaseNotification,
⬜ 143        recipient: Team | User,
⬜ 144        attachments: List[SlackAttachment],
⬜ 145        channel: str,
⬜ 146        integration: Integration,
⬜ 147    ) -> None:
⬜ 148        with sentry_sdk.start_span(op="notification.send_slack", description="notify_recipient"):
⬜ 149            # Make a local copy to which we can append.
⬜ 150            local_attachments = copy(attachments)
⬜ 151    
⬜ 152            token: str = integration.metadata["access_token"]
⬜ 153    
⬜ 154            # Add optional billing related attachment.
⬜ 155            additional_attachment = get_additional_attachment(integration, notification.organization)
⬜ 156            if additional_attachment:
⬜ 157                local_attachments.append(additional_attachment)
⬜ 158    
⬜ 159            # unfurl_links and unfurl_media are needed to preserve the intended message format
⬜ 160            # and prevent the app from replying with help text to the unfurl
⬜ 161            payload = {
⬜ 162                "token": token,
⬜ 163                "channel": channel,
⬜ 164                "link_names": 1,
⬜ 165                "unfurl_links": False,
⬜ 166                "unfurl_media": False,
⬜ 167                "text": notification.get_notification_title(),
⬜ 168                "attachments": json.dumps(local_attachments),
⬜ 169            }
⬜ 170    
⬜ 171            log_params = {
⬜ 172                "notification": notification,
⬜ 173                "recipient": recipient.id,
⬜ 174                "channel_id": channel,
⬜ 175            }
🟩 176            post_message.apply_async(
🟩 177                kwargs={
🟩 178                    "payload": payload,
🟩 179                    "log_error_message": "notification.fail.slack_post",
🟩 180                    "log_params": log_params,
🟩 181                }
⬜ 182            )
⬜ 183        # recording data outside of span
⬜ 184        notification.record_notification_sent(recipient, ExternalProviders.SLACK)
```

<br/>

Within `post_message`[<sup id="1TOja1">↓</sup>](#f-1TOja1) , we actually initialize a `SlackClient`[<sup id="Z1pbFtJ">↓</sup>](#f-Z1pbFtJ) , which is the object responsible for triggering Slack's API. Specifically, we use `post`[<sup id="Z1pTynx">↓</sup>](#f-Z1pTynx) to actually send the message.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/tasks.py
```python
🟩 330    @instrumented_task(name="sentry.integrations.slack.post_message", queue="integrations", max_retries=0)  # type: ignore
🟩 331    def post_message(
🟩 332        payload: Mapping[str, Any], log_error_message: str, log_params: Mapping[str, Any]
🟩 333    ) -> None:
🟩 334        client = SlackClient()
🟩 335        try:
🟩 336            client.post("/chat.postMessage", data=payload, timeout=5)
🟩 337        except ApiError as e:
🟩 338            extra = {"error": str(e), **log_params}
🟩 339            logger.info(log_error_message, extra=extra)
⬜ 340    
```

<br/>

`SlackClient`[<sup id="5nfp0">↓</sup>](#f-5nfp0) inherits from `ApiClient`[<sup id="Z7AWSj">↓</sup>](#f-Z7AWSj), a Base Class that is useful for dealing with all sorts of APIs. Importantly, we set the `base_url`[<sup id="1xF2x1">↓</sup>](#f-1xF2x1) to match that of Slack's API, so by using `post`[<sup id="Z1pTynx">↓</sup>](#f-Z1pTynx) on `postMessage`[<sup id="2c9VGc">↓</sup>](#f-2c9VGc) in the above snippet, we actually trigger Slack's `chat.postMessage` API:  
[https://api.slack.com/methods/chat.postMessage](https://api.slack.com/methods/chat.postMessage)
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/client.py
```python
⬜ 11     SLACK_DATADOG_METRIC = "integrations.slack.http_response"
⬜ 12     
⬜ 13     
🟩 14     class SlackClient(ApiClient):  # type: ignore
🟩 15         allow_redirects = False
🟩 16         integration_name = "slack"
🟩 17         base_url = "https://slack.com/api"
⬜ 18         datadog_prefix = "integrations.slack"
⬜ 19     
⬜ 20         def track_response_data(
```

<br/>

The same mechanism is used by `SlackNotifyBasicMixin`[<sup id="ozW20">↓</sup>](#f-ozW20) (inheriting from `NotifyBasicMixin`[<sup id="5IrRS">↓</sup>](#f-5IrRS) ), where `send_message`[<sup id="ZgLjce">↓</sup>](#f-ZgLjce) uses a `SlackClient`[<sup id="ZOXSSO">↓</sup>](#f-ZOXSSO) , use the given token to send a message using `postMessage`[<sup id="ZDi8in">↓</sup>](#f-ZDi8in) .
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/notifications.py
```python
⬜ 25     SLACK_TIMEOUT = 5
⬜ 26     
⬜ 27     
🟩 28     class SlackNotifyBasicMixin(NotifyBasicMixin):  # type: ignore
🟩 29         def send_message(self, channel_id: str, message: str) -> None:
🟩 30             client = SlackClient()
🟩 31             token = self.metadata.get("user_access_token") or self.metadata["access_token"]
🟩 32             headers = {"Authorization": f"Bearer {token}"}
🟩 33             payload = {
🟩 34                 "token": token,
🟩 35                 "channel": channel_id,
🟩 36                 "text": message,
🟩 37             }
🟩 38             try:
🟩 39                 client.post("/chat.postMessage", headers=headers, data=payload, json=True)
⬜ 40             except ApiError as e:
⬜ 41                 message = str(e)
⬜ 42                 if message != "Expired url":
```

<br/>

`SlackIntegration`[<sup id="1MLzPG">↓</sup>](#f-1MLzPG) actually inherits from `IntegrationInstallation`[<sup id="Z1AAn73">↓</sup>](#f-Z1AAn73) , so this class represents an installed integration and manages the core functionality of the integration. It also inherits from `SlackNotifyBasicMixin`[<sup id="2r9fTE">↓</sup>](#f-2r9fTE) , and so `send_message`[<sup id="ZgLjce">↓</sup>](#f-ZgLjce) is used as described above.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/integration.py
```python
🟩 69     class SlackIntegration(SlackNotifyBasicMixin, IntegrationInstallation):  # type: ignore
⬜ 70         def get_config_data(self) -> Mapping[str, str]:
⬜ 71             metadata_ = self.model.metadata
⬜ 72             # Classic bots had a user_access_token in the metadata.
```

<br/>

We also register `SlackIntegrationProvider`[<sup id="2qWzkE">↓</sup>](#f-2qWzkE) in the default integrations:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/conf/server.py
```python
⬜ 2028   SENTRY_DEFAULT_INTEGRATIONS = (
⬜ 2029       "sentry.integrations.bitbucket.BitbucketIntegrationProvider",
⬜ 2030       "sentry.integrations.bitbucket_server.BitbucketServerIntegrationProvider",
🟩 2031       "sentry.integrations.slack.SlackIntegrationProvider",
⬜ 2032       "sentry.integrations.github.GitHubIntegrationProvider",
⬜ 2033       "sentry.integrations.github_enterprise.GitHubEnterpriseIntegrationProvider",
⬜ 2034       "sentry.integrations.gitlab.GitlabIntegrationProvider",
```

<br/>

`SlackIntegrationProvider`[<sup id="2w9I3O">↓</sup>](#f-2w9I3O) is defined here:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/integration.py
```python
🟩 93     class SlackIntegrationProvider(IntegrationProvider):  # type: ignore
⬜ 94         key = "slack"
⬜ 95         name = "Slack"
⬜ 96         metadata = metadata
⬜ 97         features = frozenset([IntegrationFeatures.CHAT_UNFURL, IntegrationFeatures.ALERT_RULE])
⬜ 98         integration_cls = SlackIntegration
```

<br/>

To build the integration, the code within `SlackIntegrationProvider`[<sup id="2w9I3O">↓</sup>](#f-2w9I3O) gets all relevant information - for example, here we use `get_team_info`[<sup id="2eMJqV">↓</sup>](#f-2eMJqV) :
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/integration.py
```python
⬜ 163            team_name = data["team"]["name"]
⬜ 164            team_id = data["team"]["id"]
⬜ 165    
🟩 166            scopes = sorted(self.identity_oauth_scopes)
🟩 167            team_data = self.get_team_info(access_token)
🟩 168    
🟩 169            metadata = {
🟩 170                "access_token": access_token,
🟩 171                "scopes": scopes,
🟩 172                "icon": team_data["icon"]["image_132"],
🟩 173                "domain_name": team_data["domain"] + ".slack.com",
🟩 174                "installation_type": "born_as_bot",
🟩 175            }
🟩 176    
🟩 177            integration = {
🟩 178                "name": team_name,
🟩 179                "external_id": team_id,
🟩 180                "metadata": metadata,
🟩 181                "user_identity": {
🟩 182                    "type": "slack",
🟩 183                    "external_id": user_id_slack,
🟩 184                    "scopes": [],
🟩 185                    "data": {},
🟩 186                },
🟩 187            }
⬜ 188    
⬜ 189            return integration
⬜ 190    
```

<br/>

Which also uses Slack's API using `SlackClient`[<sup id="Z2wYOml">↓</sup>](#f-Z2wYOml) , this time - `team`[<sup id="ZJYQFV">↓</sup>](#f-ZJYQFV) . `info`[<sup id="ZyLC3i">↓</sup>](#f-ZyLC3i) API ([https://api.slack.com/methods/team.info](https://api.slack.com/methods/team.info))
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 src/sentry/integrations/slack/integration.py
```python
🟩 143        def get_team_info(self, access_token: str) -> JSONData:
🟩 144            headers = {"Authorization": f"Bearer {access_token}"}
🟩 145    
🟩 146            client = SlackClient()
🟩 147            try:
🟩 148                resp = client.get("/team.info", headers=headers)
🟩 149            except ApiError as e:
🟩 150                logger.error("slack.team-info.response-error", extra={"error": str(e)})
🟩 151                raise IntegrationError("Could not retrieve Slack team information.")
🟩 152    
🟩 153            return resp["team"]
```

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-Ns1D4">_notify_recipient</span>[^](#Ns1D4) - "src/sentry/integrations/slack/notifications.py" L141
```python
def _notify_recipient(
```

<span id="f-6EM4S">_notify_recipient</span>[^](#6EM4S) - "src/sentry/integrations/slack/notifications.py" L210
```python
                _notify_recipient(
```

<span id="f-Z7AWSj">ApiClient</span>[^](#Z7AWSj) - "src/sentry/integrations/slack/client.py" L14
```python
class SlackClient(ApiClient):  # type: ignore
```

<span id="f-1xF2x1">base_url</span>[^](#1xF2x1) - "src/sentry/integrations/slack/client.py" L17
```python
    base_url = "https://slack.com/api"
```

<span id="f-27HfhR">chat</span>[^](#27HfhR) - "src/sentry/integrations/slack/tasks.py" L336
```python
        client.post("/chat.postMessage", data=payload, timeout=5)
```

<span id="f-2eMJqV">get_team_info</span>[^](#2eMJqV) - "src/sentry/integrations/slack/integration.py" L167
```python
        team_data = self.get_team_info(access_token)
```

<span id="f-ZyLC3i">info</span>[^](#ZyLC3i) - "src/sentry/integrations/slack/integration.py" L148
```python
            resp = client.get("/team.info", headers=headers)
```

<span id="f-Z1AAn73">IntegrationInstallation</span>[^](#Z1AAn73) - "src/sentry/integrations/slack/integration.py" L69
```python
class SlackIntegration(SlackNotifyBasicMixin, IntegrationInstallation):  # type: ignore
```

<span id="f-5IrRS">NotifyBasicMixin</span>[^](#5IrRS) - "src/sentry/integrations/slack/notifications.py" L28
```python
class SlackNotifyBasicMixin(NotifyBasicMixin):  # type: ignore
```

<span id="f-Z1pTynx">post</span>[^](#Z1pTynx) - "src/sentry/integrations/slack/tasks.py" L336
```python
        client.post("/chat.postMessage", data=payload, timeout=5)
```

<span id="f-1TOja1">post_message</span>[^](#1TOja1) - "src/sentry/integrations/slack/tasks.py" L331
```python
def post_message(
```

<span id="f-2bCIQu">post_message</span>[^](#2bCIQu) - "src/sentry/integrations/slack/notifications.py" L176
```python
        post_message.apply_async(
```

<span id="f-ZDi8in">postMessage</span>[^](#ZDi8in) - "src/sentry/integrations/slack/notifications.py" L39
```python
            client.post("/chat.postMessage", headers=headers, data=payload, json=True)
```

<span id="f-2c9VGc">postMessage</span>[^](#2c9VGc) - "src/sentry/integrations/slack/tasks.py" L336
```python
        client.post("/chat.postMessage", data=payload, timeout=5)
```

<span id="f-2tFk57">register_notification_provider</span>[^](#2tFk57) - "src/sentry/integrations/slack/notifications.py" L187
```python
@register_notification_provider(ExternalProviders.SLACK)
```

<span id="f-ZgLjce">send_message</span>[^](#ZgLjce) - "src/sentry/integrations/slack/notifications.py" L29
```python
    def send_message(self, channel_id: str, message: str) -> None:
```

<span id="f-Z1BPQQt">send_notification_as_slack</span>[^](#Z1BPQQt) - "src/sentry/integrations/slack/notifications.py" L188
```python
def send_notification_as_slack(
```

<span id="f-Z2wYOml">SlackClient</span>[^](#Z2wYOml) - "src/sentry/integrations/slack/integration.py" L146
```python
        client = SlackClient()
```

<span id="f-ZOXSSO">SlackClient</span>[^](#ZOXSSO) - "src/sentry/integrations/slack/notifications.py" L30
```python
        client = SlackClient()
```

<span id="f-5nfp0">SlackClient</span>[^](#5nfp0) - "src/sentry/integrations/slack/client.py" L14
```python
class SlackClient(ApiClient):  # type: ignore
```

<span id="f-Z1pbFtJ">SlackClient</span>[^](#Z1pbFtJ) - "src/sentry/integrations/slack/tasks.py" L334
```python
    client = SlackClient()
```

<span id="f-1MLzPG">SlackIntegration</span>[^](#1MLzPG) - "src/sentry/integrations/slack/integration.py" L69
```python
class SlackIntegration(SlackNotifyBasicMixin, IntegrationInstallation):  # type: ignore
```

<span id="f-2qWzkE">SlackIntegrationProvider</span>[^](#2qWzkE) - "src/sentry/conf/server.py" L2031
```python
    "sentry.integrations.slack.SlackIntegrationProvider",
```

<span id="f-2w9I3O">SlackIntegrationProvider</span>[^](#2w9I3O) - "src/sentry/integrations/slack/integration.py" L93
```python
class SlackIntegrationProvider(IntegrationProvider):  # type: ignore
```

<span id="f-2r9fTE">SlackNotifyBasicMixin</span>[^](#2r9fTE) - "src/sentry/integrations/slack/integration.py" L69
```python
class SlackIntegration(SlackNotifyBasicMixin, IntegrationInstallation):  # type: ignore
```

<span id="f-ozW20">SlackNotifyBasicMixin</span>[^](#ozW20) - "src/sentry/integrations/slack/notifications.py" L28
```python
class SlackNotifyBasicMixin(NotifyBasicMixin):  # type: ignore
```

<span id="f-ZJYQFV">team</span>[^](#ZJYQFV) - "src/sentry/integrations/slack/integration.py" L148
```python
            resp = client.get("/team.info", headers=headers)
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc2VudHJ5JTNBJTNBc3dpbW1pbw==/docs/2ya4l).