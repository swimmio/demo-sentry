---
title: What is Auth
---
In the context of the `demo-sentry` repository, 'Auth' refers to the authentication process that verifies the identity of users trying to access the system. The `auth` directory in `static/app/views/auth` contains several components related to this process, such as login, registration, and single sign-on forms. The `authConfig` state member is used to store configuration details for various authentication providers like GitHub, Google, and VSTS. The `hasAuthProviders` method checks if any of these providers are available. The `response` constant is used to handle responses from API requests related to authentication.

<SwmSnippet path="/static/app/views/auth/loginForm.tsx" line="83">

---

# Authentication Endpoints

The `/auth/login/` endpoint is used in the `LoginForm` component. This endpoint is hit when a user attempts to log in, with the `POST` method being used to send the user's login data to the server.

```tsx
      const response = await this.props.api.requestPromise('/auth/login/', {
        method: 'POST',
        data,
      });
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/auth/registerForm.tsx" line="54">

---

The `/auth/register/` endpoint is used in the `RegisterForm` component. This endpoint is hit when a new user attempts to register, with the `POST` method being used to send the user's registration data to the server.

```tsx
      const response = await api.requestPromise('/auth/register/', {
        method: 'POST',
        data,
      });
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/auth/ssoForm.tsx" line="27">

---

The `/auth/sso-locate/` endpoint is used in the `SsoForm` component. This endpoint is hit when a user attempts to log in using Single Sign-On (SSO), with the `POST` method being used to send the user's SSO data to the server.

```tsx
      const response = await api.requestPromise('/auth/sso-locate/', {
        method: 'POST',
        data,
      });
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/auth/login.tsx" line="58">

---

The `/auth/config/` endpoint is used in the `Login` component. This endpoint is hit when the component mounts to fetch the authentication configuration.

```tsx
      const response = await api.requestPromise('/auth/config/');

      const {vsts_login_link, github_login_link, google_login_link, ...config} = response;
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
