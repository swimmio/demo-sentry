---
title: Controlling Appearance and Responsiveness in Global Modal
---
This document will cover the control of the appearance and responsiveness of modals in the demo-sentry repository. We'll cover:

1. How modals are defined and used
2. How modal appearance is controlled
3. How modal responsiveness is managed.

<SwmSnippet path="/static/app/actionCreators/modal.tsx" line="159">

---

# Defining and Using Modals

The function `openRecoveryOptions` is an example of how modals are defined and used. It imports the `RecoveryOptionsModal` component and opens it with the provided options.

```tsx
export async function openRecoveryOptions(options: RecoveryModalOptions) {
  const mod = await import('sentry/components/modals/recoveryOptionsModal');
  const {default: Modal} = mod;

  openModal(deps => <Modal {...deps} {...options} />);
}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/actionCreators/modal.tsx" line="274">

---

# Controlling Modal Appearance

The appearance of the modal is controlled by the `modalCss` property. This is passed to the `openModal` function along with the modal component and its options.

```tsx
  const mod = await import('sentry/components/modals/demoSignUp');
  const {default: Modal, modalCss} = mod;

  openModal(deps => <Modal {...deps} {...options} />, {modalCss});
}
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
