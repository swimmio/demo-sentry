---
title: Forms 101
---
# Forms in Sentry

Forms in the Sentry application are managed using a `FormModel` class, which is defined in `static/app/components/forms/model.tsx`. This class is responsible for managing the state of the form, including the values of individual fields, errors, and the overall state of the form. The `FormModel` class also provides methods for resetting the form, setting initial data, and setting form options. The `FormModel` is used in various components throughout the application, such as `static/app/components/forms/form.tsx`, which is a general form component that uses the `FormModel` to manage its state. The `FormModel` is also used in specific form components, such as `static/app/components/forms/inputField.tsx` and `static/app/components/forms/checkboxField.tsx`, to manage their individual states. The `FormModel` provides a consistent way to manage form state across the application, making it easier to handle user input and form submission.

<SwmSnippet path="/static/app/components/forms/form.tsx" line="27">

---

# Form Endpoints

In `form.tsx`, the `Props` type defines the properties of the form component. Among these properties are `apiEndpoint` and `apiMethod`, which specify the URL of the API endpoint the form submits to and the HTTP method to use, respectively. These properties allow the form to interact with the backend.

```tsx
  apiEndpoint?: string;
  /**
   * The HTTP method to use.
   */
  apiMethod?: APIRequestMethod;
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/components/forms/apiForm.tsx" line="9">

---

# API Form

In `apiForm.tsx`, the `ApiForm` component extends the `Form` component and includes additional properties `apiEndpoint` and `apiMethod`. The `onSubmit` method makes an API request to the specified endpoint using the specified method when the form is submitted. This component demonstrates how forms can be used to interact with APIs.

```tsx
  apiEndpoint: string;
  apiMethod: string;
  onSubmit?: (data: Record<string, any>) => void;
};

export default class ApiForm extends Component<Props> {
  componentWillUnmount() {
    this.api.clear();
  }

  api: Client = new Client();

  onSubmit = (
    data: Record<string, any>,
    onSuccess: (response: Record<string, any>) => void,
    onError: (error: any) => void
  ) => {
    this.props.onSubmit && this.props.onSubmit(data);
    addLoadingMessage(t('Saving changes\u2026'));
    this.api.request(this.props.apiEndpoint, {
      method: this.props.apiMethod,
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
