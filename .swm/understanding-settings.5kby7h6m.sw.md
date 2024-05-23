---
title: Understanding Settings
---
In the demo-sentry repository, 'Settings' refers to the configuration options available for different entities such as organizations, projects, and teams. These settings are defined in the form of JSON objects in the respective files located in the `static/app/data/forms` directory. Each settings form is defined with a unique route and contains various fields. Each field has properties like name, type, label, and help text. Some fields have additional properties like `choices` which provide a list of options for a select field, `disabled` which determines if a field should be disabled based on certain conditions, and `saveMessage` which provides a custom message after saving the form. The settings allow users to customize the behavior of their organizations, projects, and teams according to their requirements.

<SwmSnippet path="/static/app/data/forms/accountDetails.tsx" line="3">

---

# Settings Endpoints

This file defines the form object for the account details settings page. The route `/settings/account/details/` is the endpoint for this settings page. The form object includes fields for the user's name and username, which are required and must be strings.

```tsx
export const route = '/settings/account/details/';

// For fields that are
const getUserIsManaged = ({user}) => user.isManaged;

const formGroups: JsonFormObject[] = [
  {
    // Form "section"/"panel"
    title: 'Account Details',
    fields: [
      {
        name: 'name',
        type: 'string',
        required: true,

        // additional data/props that is related to rendering of form field rather than data
        label: 'Name',
        placeholder: 'e.g. John Doe',
        help: 'Your full name',
      },
      {
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/data/forms/accountPassword.tsx" line="3">

---

This file defines the form object for the account password settings page. The route `/settings/account/security/` is the endpoint for this settings page. The form object includes fields for the user's current password, new password, and password verification, all of which are required and must be kept secret.

```tsx
const getUserIsNotManaged = ({user}) => !user.isManaged;

const formGroups: JsonFormObject[] = [
  {
    // Form "section"/"panel"
    title: 'Password',
    fields: [
      {
        name: 'password',
        type: 'secret',
        autoComplete: 'current-password',
        label: 'Current Password',
        placeholder: '',
        help: 'Your current password',
        visible: getUserIsNotManaged,
        required: true,
      },
      {
        name: 'passwordNew',
        type: 'secret',
        autoComplete: 'new-password',
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
