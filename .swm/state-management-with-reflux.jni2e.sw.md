---
id: jni2e
name: State Management with Reflux
file_version: 1.0.2
app_version: 0.8.5-0
file_blobs:
  static/app/actions/pageFiltersActions.tsx: 8d6f2485c157b80586df789ae5c655bf51299ec7
  static/app/stores/pageFiltersStore.tsx: c04a27b5e33fd62b865b58b4bddac1be1b899f3e
  static/app/actionCreators/pageFilters.tsx: 2b27c6d727455f7dde4fa3ea8210a4b6162b661f
  static/app/types/core.tsx: c27f92c56ab334744f9a5a39990b7b86e6c1aa27
---

We currently use [Reflux](https://github.com/reflux/refluxjs) for managing global state. Reflux is a simple library for unidirectional dataflow architecture inspired by ReactJS [Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html).

# Overview

The main function of Reflux is to introduce a more functional programming style architecture by adopting a single data flow pattern.

```
+---------+       +--------+       +-----------------+
¦ Actions ¦------>¦ Stores ¦------>¦ View Components ¦
+---------+       +--------+       +-----------------+
     ^                                      ¦
     +--------------------------------------+
```

The pattern is composed of actions and data stores, where actions initiate new data to pass through data stores before coming back to the view components again. If a view component has an event that needs to make a change in the application's data stores, they need to do so by signaling to the stores through the actions available.

We will use `PageFilters`[<sup id="1HGoLB">↓</sup>](#f-1HGoLB) for our example.

For usage, you need to create actions which can be called from React components. Those actions are listened to by stores which hold and update data. In turn those stores are hooked up to React components and set state within them as it is updated within the store.

So there are three parts:

# 1\. Creating Actions

An action is a [function object](http://en.wikipedia.org/wiki/Function_object) that can be invoked like any other function.

Actions are registered under `📄 static/app/actions` , e.g., `PageFiltersActions`[<sup id="Z2wU2DS">↓</sup>](#f-Z2wU2DS) are registered in `📄 static/app/actions/pageFiltersActions.tsx`

<br/>

To create actions we use `createActions`[<sup id="1Hy98y">↓</sup>](#f-1Hy98y) , like so:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/actions/pageFiltersActions.tsx
```tsx
⬜ 1      import {createActions} from 'reflux';
⬜ 2      
🟩 3      const PageFiltersActions = createActions([
🟩 4        'reset',
🟩 5        'initializeUrlState',
🟩 6        'updateProjects',
🟩 7        'updateDateTime',
🟩 8        'updateEnvironments',
🟩 9        'updateDesyncedFilters',
🟩 10       'pin',
🟩 11     ]);
⬜ 12     
⬜ 13     export default PageFiltersActions;
⬜ 14     
```

<br/>

## More on Actions

Actions can also:

*   load files asynchronously with child actions
    
*   do preEmit and shouldEmit checking
    
*   have many shortcuts for easy usage
    

See [Reflux Action Documentation](https://github.com/reflux/refluxjs/blob/master/docs/actions) for more.

<br/>

# 2\. Creating a Store

Stores are registered under `📄 static/app/stores` , e.g., `📄 static/app/stores/pageFiltersStore.tsx` .

Create a data store much like ReactJS's own `React.Component` .

<br/>

The store has a `State`[<sup id="Z1cSjpV">↓</sup>](#f-Z1cSjpV) property much like a component.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/stores/pageFiltersStore.tsx
```tsx
⬜ 9      
⬜ 10     import {CommonStoreDefinition} from './types';
⬜ 11     
🟩 12     type State = {
🟩 13       desyncedFilters: Set<PinnedPageFilter>;
🟩 14       isReady: boolean;
🟩 15       pinnedFilters: Set<PinnedPageFilter>;
🟩 16       selection: PageFilters;
🟩 17     };
⬜ 18     
⬜ 19     type InternalDefinition = {
⬜ 20       /**
```

<br/>

You may set up all action listeners in the `init`[<sup id="Zg8NuN">↓</sup>](#f-Zg8NuN) method, and register them by calling the store's own `listenTo`[<sup id="ZKp0og">↓</sup>](#f-ZKp0og) function.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/stores/pageFiltersStore.tsx
```tsx
⬜ 57       hasInitialState: false,
⬜ 58       unsubscribeListeners: [],
⬜ 59     
🟩 60       init() {
🟩 61         this.reset(this.selection);
🟩 62     
🟩 63         this.unsubscribeListeners.push(this.listenTo(PageFiltersActions.reset, this.onReset));
⬜ 64         this.unsubscribeListeners.push(
⬜ 65           this.listenTo(PageFiltersActions.initializeUrlState, this.onInitializeUrlState)
⬜ 66         );
```

<br/>

#### **More on Stores:**

Reflux stores are very powerful. They can even do things like contribute to a global state that can be read and set for partial or full-state time-travel, debugging, etc.

See [Reflux Store Documentation](https://github.com/reflux/refluxjs/blob/master/docs/stores) to learn more about stores.

<br/>

# 3\. Dispatch Actions using Action Creators

We use action creator functions (under `📄 static/app/actionCreators` ) to dispatch actions.

<br/>

For example:
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/actionCreators/pageFilters.tsx
```tsx
⬜ 91     /**
⬜ 92      * Reset values in the page filters store
⬜ 93      */
🟩 94     export function resetPageFilters() {
🟩 95       PageFiltersActions.reset();
🟩 96     }
```

<br/>

Reflux stores listen to actions and update themselves accordingly.

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-1Hy98y">createActions</span>[^](#1Hy98y) - "static/app/actions/pageFiltersActions.tsx" L1
```tsx
import {createActions} from 'reflux';
```

<span id="f-Zg8NuN">init</span>[^](#Zg8NuN) - "static/app/stores/pageFiltersStore.tsx" L60
```tsx
  init() {
```

<span id="f-ZKp0og">listenTo</span>[^](#ZKp0og) - "static/app/stores/pageFiltersStore.tsx" L63
```tsx
    this.unsubscribeListeners.push(this.listenTo(PageFiltersActions.reset, this.onReset));
```

<span id="f-1HGoLB">PageFilters</span>[^](#1HGoLB) - "static/app/types/core.tsx" L81
```tsx
export type PageFilters = {
```

<span id="f-Z2wU2DS">PageFiltersActions</span>[^](#Z2wU2DS) - "static/app/actions/pageFiltersActions.tsx" L3
```tsx
const PageFiltersActions = createActions([
```

<span id="f-Z1cSjpV">State</span>[^](#Z1cSjpV) - "static/app/stores/pageFiltersStore.tsx" L12
```tsx
type State = {
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc2VudHJ5JTNBJTNBc3dpbW1pbw==/docs/jni2e).