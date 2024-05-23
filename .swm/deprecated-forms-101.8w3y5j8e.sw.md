---
title: Deprecated Forms 101
---
# Deprecated Forms

Deprecated forms in the `demo-sentry` repository are a set of React components located in `static/app/components/deprecatedforms`. These components were used to create and manage forms in the application. The term 'deprecated' suggests that these components are no longer recommended for use, and are likely to be removed in future updates. They include various types of form fields such as `BooleanField`, `EmailField`, `NumberField`, `TextField`, and others. Each of these components has a specific purpose and is used to capture and handle a specific type of user input. The `Form` component is a general form container that manages the form state, handles form submission, and renders the form fields. It's worth noting that while these components are deprecated, they might still be used in some parts of the codebase, and understanding them can be useful for understanding the history and evolution of the codebase.

<SwmSnippet path="/static/app/components/deprecatedforms/apiForm.tsx" line="1">

---

# ApiForm Component

The `ApiForm` component is a specialized form that interacts with an API endpoint. It takes in properties such as `apiEndpoint` and `apiMethod` which define the API endpoint and the HTTP method to use for the request. The `onSubmit` method is overridden to make an API request when the form is submitted. The `api.request` method is used to make the request to the `apiEndpoint` with the `apiMethod` and the form data. The `onSubmitSuccess` and `onSubmitError` methods are called based on the result of the API request.

```tsx
import * as React from 'react';

import {
  addErrorMessage,
  addLoadingMessage,
  clearIndicators,
} from 'sentry/actionCreators/indicator';
import {APIRequestMethod, Client} from 'sentry/api';
import Form from 'sentry/components/deprecatedforms/form';
import FormField from 'sentry/components/deprecatedforms/formField';
import FormState from 'sentry/components/forms/state';
import {t} from 'sentry/locale';

type Props = Form['props'] & {
  apiEndpoint: string;
  apiMethod: APIRequestMethod;
  omitDisabled?: boolean;
  onSubmit?: (data: object) => void;
  submitErrorMessage?: string;
  submitLoadingMessage?: string;
};
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
