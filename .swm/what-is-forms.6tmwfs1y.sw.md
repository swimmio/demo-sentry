---
title: What is Forms
---
# Forms in Sentry

In the Sentry application, forms are a crucial part of the user interface, allowing users to input and submit data. The `FormModel` class, located in `static/app/components/forms/model.tsx`, is a central part of the form handling system. It manages the state of individual fields and the form as a whole, including field values, errors, and form submission state. The `FormModel` also provides methods to reset the form, set initial data, and set form options. The `Form` component, located in `static/app/components/forms/form.tsx`, uses the `FormModel` to manage its state and handle form submission. It also provides a flexible rendering system, allowing for custom rendering of form fields and footers. The `Form` component is used throughout the application in various contexts, such as in the settings, integrations, and alerts sections. The `forms` directory also includes a variety of specific form field components, such as `InputField`, `SelectField`, and `CheckboxField`, which are used to build up complex forms.

<SwmSnippet path="/static/app/components/forms/form.tsx" line="27">

---

# Form Component

The `Form` component accepts `apiEndpoint` and `apiMethod` as props. `apiEndpoint` is the URL to the API endpoint this form submits to, and `apiMethod` is the HTTP method to use for the request. These props define the endpoint of the form.

```tsx
  apiEndpoint?: string;
  /**
   * The HTTP method to use.
   */
  apiMethod?: APIRequestMethod;
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/forms/apiForm.tsx" line="26">

---

# ApiForm Component

The `ApiForm` component extends the `Form` component and overrides the `onSubmit` method. It uses the `apiEndpoint` and `apiMethod` props to make an API request when the form is submitted. The `api.request` method is used to send the request to the specified `apiEndpoint` with the specified `apiMethod`.

```tsx
    this.props.onSubmit && this.props.onSubmit(data);
    addLoadingMessage(t('Saving changes\u2026'));
    this.api.request(this.props.apiEndpoint, {
      method: this.props.apiMethod,
      data,
      success: response => {
        clearIndicators();
        onSuccess(response);
      },
      error: error => {
        clearIndicators();
        onError(error);
      },
    });
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
