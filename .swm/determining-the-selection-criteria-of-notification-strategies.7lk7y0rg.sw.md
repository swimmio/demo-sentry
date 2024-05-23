---
title: Determining the selection criteria of notification strategies
---
This document will cover the process of handling a notification in the Sentry application, which includes:

1. Validating the notification scope and value
2. Sending the notification via Slack or Email
3. Testing the notification functionality

<SwmSnippet path="/src/sentry/api/validators/notifications.py" line="87">

---

# Validating the Notification Scope and Value

The function `validate_scope` is used to validate the scope of the notification. It checks if the scope type is a user and if the scope id matches the user id. If the scope id is 'me', it is replaced with the current user's id. If the scope id does not match the user id, a validation error is raised. The function also attempts to convert the scope id into an integer and raises a validation error if it fails.

```python
def validate_scope(
    scope_id: Union[int, str],
    scope_type: NotificationScopeType,
    user: Optional[Any] = None,
    context: Optional[List[str]] = None,
) -> int:
    if user and scope_type == NotificationScopeType.USER:
        if scope_id == "me":
            # Overwrite "me" with the current user's ID.
            scope_id = user.id
        elif scope_id != str(user.id):
            raise ParameterValidationError(f"Incorrect user ID: {scope_id}", context)

    try:
        return int(scope_id)
    except ValueError:
        raise ParameterValidationError(f"Invalid ID: {scope_id}", context)
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/api/validators/notifications.py" line="106">

---

The function `validate_value` is used to validate the value of the notification setting. It checks if the value is in the `NOTIFICATION_SETTING_OPTION_VALUES` dictionary and raises a validation error if it is not. It also checks if the value is valid for the given type and raises a validation error if it is not.

```python
def validate_value(
    type: NotificationSettingTypes, value_param: str, context: Optional[List[str]] = None
) -> NotificationSettingOptionValues:
    try:
        value = {v: k for k, v in NOTIFICATION_SETTING_OPTION_VALUES.items()}[value_param]
    except KeyError:
        raise ParameterValidationError(f"Unknown value: {value_param}", context)

    if value != NotificationSettingOptionValues.DEFAULT and not helper_validate(type, value):
        raise ParameterValidationError(f"Invalid value for type {type}: {value}", context)
    return value
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/integrations/slack/notifications.py" line="188">

---

# Sending the Notification via Slack

The function `send_notification_as_slack` is used to send a notification to a Slack user or team. It first gets the integrations by channel for each recipient. Then, for each recipient and each channel, it calls the `_notify_recipient` function to send the notification.

```python
def send_notification_as_slack(
    notification: BaseNotification,
    recipients: Iterable[Team | User],
    shared_context: Mapping[str, Any],
    extra_context_by_actor_id: Mapping[int, Mapping[str, Any]] | None,
) -> None:
    """Send an "activity" or "alert rule" notification to a Slack user or team."""
    with sentry_sdk.start_span(
        op="notification.send_slack", description="gen_channel_integration_map"
    ):
        data = get_integrations_by_channel_by_recipient(notification.organization, recipients)
    for recipient, integrations_by_channel in data.items():
        with sentry_sdk.start_span(op="notification.send_slack", description="send_one"):
            with sentry_sdk.start_span(op="notification.send_slack", description="gen_attachments"):
                attachments = get_attachments(
                    notification,
                    recipient,
                    shared_context,
                    extra_context_by_actor_id,
                )

```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/mail/notifications.py" line="105">

---

# Sending the Notification via Email

The function `send_notification_as_email` is used to send a notification to a user via email. It first logs the notification, then builds the email message using the `MessageBuilder` class, and finally sends the email message asynchronously.

```python
def send_notification_as_email(
    notification: BaseNotification,
    recipients: Iterable[Team | User],
    shared_context: Mapping[str, Any],
    extra_context_by_actor_id: Mapping[int, Mapping[str, Any]] | None,
) -> None:
    for recipient in recipients:
        with sentry_sdk.start_span(op="notification.send_email", description="one_recipient"):
            if isinstance(recipient, Team):
                # TODO(mgaeta): MessageBuilder only works with Users so filter out Teams for now.
                continue
            log_message(notification, recipient)

            with sentry_sdk.start_span(op="notification.send_email", description="build_message"):
                msg = MessageBuilder(
                    **get_builder_args(
                        notification, recipient, shared_context, extra_context_by_actor_id
                    )
                )

            with sentry_sdk.start_span(op="notification.send_email", description="send_message"):
```

---

</SwmSnippet>

<SwmSnippet path="/src/sentry/management/commands/check_notifications.py" line="34">

---

# Testing the Notification Functionality

The `handle` function in the `check_notifications` management command is used to test the notification functionality. It gets the projects for the given organization or project id and then calls the `handle_project` function for each project to check the notifications.

```python
    def handle(self, *args, **options):
        if not (options["project"] or options["organization"]):
            raise CommandError("Must specify either a project or organization")

        if options["organization"]:
            projects = list(Organization.objects.get(pk=options["organization"]).project_set.all())
        else:
            projects = [Project.objects.get(pk=options["project"])]

        for project in projects:
            handle_project(project, self.stdout)
            self.stdout.write("\n")
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
