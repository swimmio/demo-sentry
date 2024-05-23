---
title: State and Data Management in the Global Modal Component
---
This document will cover the management of state and data within the Global Modal component, which includes:

1. The structure of the state
2. How state is updated
3. How data is fetched and used.

<SwmSnippet path="/static/app/views/settings/components/dataScrubbing/modals/modalManager.tsx" line="44">

---

# The structure of the state

The `State` type defines the structure of the state within the `ModalManager` component. It includes properties such as `errors`, `eventId`, and others which are used to manage the state of the modal.

```tsx
type State = {
  errors: FormProps['errors'];
  eventId: EventId;
```

---

</SwmSnippet>

<SwmSnippet path="/static/app/views/settings/components/dataScrubbing/modals/modalManager.tsx" line="53">

---

# How state is updated

The `ModalManager` class component uses the React component lifecycle methods `componentDidMount` and `componentDidUpdate` to validate the form and load source suggestions. The `getDefaultState` method is used to initialize the state of the component.

```tsx
class ModalManager<T extends ProjectId> extends React.Component<Props<T>, State> {
  state = this.getDefaultState();

  componentDidMount() {
    this.handleValidateForm();
  }

  componentDidUpdate(_prevProps: Props<T>, prevState: State) {
    if (!isEqual(prevState.values, this.state.values)) {
      this.handleValidateForm();
    }

    if (prevState.eventId.value !== this.state.eventId.value) {
      this.loadSourceSuggestions();
    }
    if (prevState.eventId.status !== this.state.eventId.status) {
      saveToSourceGroupData(this.state.eventId, this.state.sourceSuggestions);
    }
  }

  getDefaultState(): Readonly<State> {
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
