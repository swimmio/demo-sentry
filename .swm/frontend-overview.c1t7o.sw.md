---
id: c1t7o
name: Frontend Overview
file_version: 1.0.2
app_version: 0.8.7-0
file_blobs:
  static/app/sentryTypes.tsx: 0fe070ac5d22d1d33a58de460c6c56b3b9841abf
---

The frontend codebase is under `📄 static/app` . Our framework is [ReactJS](https://reactjs.org/). There are additional folders related to the frontend in additional locations, as described below.

The main folders to know are:

# Components

We use UI components that are designed to be highly reusable.

## `📄 static/app/components`

Components are located under this folder - for example `📄 static/app/components/idBadge` .

Placing an `index` file in a component folder provides a way to implicitly import the main file without specifying it.

If the folder is created to group components that are used together, and there is an entrypoint component, that uses the components within the grouping - the entrypoint component should be the index file. For example, see `📄 static/app/components/idBadge/index.tsx`

## `📄 docs-ui/stories/components`

Note that every component should have a corresponding `.stories.js` file that documents how it should be used. For example, `📄 static/app/components/idBadge` has the corresponding file `📄 docs-ui/stories/components/idBadge.stories.js`

## `📄 tests/js/spec/components`

Tests for components. E.g., `📄 tests/js/spec/components/idBadge`

# Views

We use views for UI that will typically not be reused in other parts of the codebase.

## `📄 static/app/views`

Views are located under this folder.

## `📄 tests/js/spec/views`

Tests for views. E.g., `📄 tests/js/spec/views/accountClose.spec.jsx` for `📄 static/app/views/settings/account/accountClose.tsx` .

# State Management

We use [Reflux](https://github.com/reflux/refluxjs) for managing our global state. Reflux implements the unidirectional data flow pattern outlined by [Flux](https://facebook.github.io/flux/).

*   `📄 static/app/stores` - stores are registered here, and are used to store various pieces of data used by the application. For example, `📄 static/app/stores/groupStore.tsx`
    
*   `📄 static/app/actions` - actions are registered here, e.g., `📄 static/app/actions/groupActions.tsx` .
    
*   `📄 static/app/actionCreators` - action creator functions are used to dispatch actions. For example, `📄 static/app/actionCreators/group.tsx`. Reflux stores listen to actions and update themselves accordingly.
    

To learn more about our use of Reflux, refer to [State Management with Reflux](state-management-with-reflux.jni2e.sw.md) .

# Important Files

## `📄 static/app/main.tsx`

This is the web app's entry point.

<br/>

## `📄 static/app/utils/theme.tsx`

Defines many useful constants (z-indexes, paddings, colors). We use these constants when we create components.

<br/>

# Important shared custom PropTypes

<br/>

If you’re re-using a custom prop-type or passing around a common shared shape like an organization, project, or user, then be sure to import a proptype from our useful collection of custom ones defined in `📄 static/app/sentryTypes.tsx`, for example:

<br/>

`Avatar`[<sup id="yz6UN">↓</sup>](#f-yz6UN) : Represents an Avatar. You can see it is also used in other types, e.g., `User`[<sup id="PNQf4">↓</sup>](#f-PNQf4) - `Avatar`[<sup id="2j5cD9">↓</sup>](#f-2j5cD9) .
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/sentryTypes.tsx
```tsx
⬜ 1      import * as PropTypes from 'prop-types';
⬜ 2      
🟩 3      const Avatar = PropTypes.shape({
🟩 4        avatarType: PropTypes.oneOf(['letter_avatar', 'upload', 'gravatar']),
🟩 5        avatarUuid: PropTypes.string,
🟩 6      });
```

<br/>

`User`[<sup id="PNQf4">↓</sup>](#f-PNQf4) : Represents a user in the system.
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/sentryTypes.tsx
```tsx
🟩 8      const User = PropTypes.shape({
🟩 9        avatar: Avatar,
🟩 10       avatarUrl: PropTypes.string,
🟩 11       dateJoined: PropTypes.string,
🟩 12       email: PropTypes.string,
🟩 13       emails: PropTypes.arrayOf(
🟩 14         PropTypes.shape({
🟩 15           is_verified: PropTypes.bool,
🟩 16           id: PropTypes.string,
🟩 17           email: PropTypes.string,
🟩 18         })
🟩 19       ),
🟩 20       has2fa: PropTypes.bool,
🟩 21       hasPasswordAuth: PropTypes.bool,
🟩 22       id: PropTypes.string,
🟩 23       identities: PropTypes.array,
🟩 24       isActive: PropTypes.bool,
🟩 25       isManaged: PropTypes.bool,
🟩 26       lastActive: PropTypes.string,
🟩 27       lastLogin: PropTypes.string,
🟩 28       username: PropTypes.string,
🟩 29     });
```

<br/>

`Team`[<sup id="DxIO3">↓</sup>](#f-DxIO3) : represents a team
<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->
### 📄 static/app/sentryTypes.tsx
```tsx
⬜ 76       userCount: PropTypes.number,
⬜ 77     });
⬜ 78     
🟩 79     const Team = PropTypes.shape({
🟩 80       id: PropTypes.string.isRequired,
🟩 81       slug: PropTypes.string.isRequired,
🟩 82     });
⬜ 83     
⬜ 84     /**
⬜ 85      * @deprecated
```

<br/>

<!-- THIS IS AN AUTOGENERATED SECTION. DO NOT EDIT THIS SECTION DIRECTLY -->
### Swimm Note

<span id="f-2j5cD9">Avatar</span>[^](#2j5cD9) - "static/app/sentryTypes.tsx" L9
```tsx
  avatar: Avatar,
```

<span id="f-yz6UN">Avatar</span>[^](#yz6UN) - "static/app/sentryTypes.tsx" L3
```tsx
const Avatar = PropTypes.shape({
```

<span id="f-DxIO3">Team</span>[^](#DxIO3) - "static/app/sentryTypes.tsx" L79
```tsx
const Team = PropTypes.shape({
```

<span id="f-PNQf4">User</span>[^](#PNQf4) - "static/app/sentryTypes.tsx" L8
```tsx
const User = PropTypes.shape({
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBc2VudHJ5JTNBJTNBc3dpbW1pbw==/docs/c1t7o).