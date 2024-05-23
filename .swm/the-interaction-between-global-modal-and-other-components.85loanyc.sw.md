---
title: The Interaction Between Global Modal and Other Components
---
This document will cover the interaction of the Global Modal component with other components in the Sentry application. We'll cover:

1. How the Global Modal is defined and used
2. How the Global Modal interacts with other modals
3. How the Global Modal is tested.

<SwmSnippet path="/static/app/components/globalModal/index.tsx" line="261">

---

# Global Modal Definition and Usage

The `GlobalModalContainer` class in `index.tsx` is the main definition of the Global Modal component. It listens to the `ModalStore` for changes and renders the Global Modal when the renderer function is defined in the store. The `openModal` function is used to open the modal by setting the renderer function in the store.

```tsx
class GlobalModalContainer extends React.Component<Partial<Props>, State> {
  state: State = {
    modalStore: ModalStore.get(),
  };

  componentWillUnmount() {
    this.unlistener?.();
  }

  unlistener = ModalStore.listen(
    (modalStore: State['modalStore']) => this.setState({modalStore}),
    undefined
  );

  render() {
    const {modalStore} = this.state;
    const visible = !!modalStore && typeof modalStore.renderer === 'function';

    return (
      <GlobalModal {...this.props} {...modalStore} visible={visible}>
        {visible ? modalStore.renderer : null}
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/actionCreators/modal.tsx" line="108">

---

# Interaction with Other Modals

The `openCreateTeamModal` function in `modal.tsx` demonstrates how the Global Modal interacts with other modals. It imports the `CreateTeamModal` component and opens it using the `openModal` function. The `openModal` function is used in a similar way to open other modals.

```tsx
export async function openCreateTeamModal(options: CreateTeamModalOptions) {
  const mod = await import('sentry/components/modals/createTeamModal');
  const {default: Modal} = mod;

  openModal(deps => <Modal {...deps} {...options} />);
}
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
