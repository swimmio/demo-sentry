---
title: The Importance of Tracking Database Schema Changes
---
This document will cover the importance of tracking database schema changes in the context of the demo-sentry repository. We'll cover:

1. The role of the `_execute_create_test_db` function in managing database changes.
2. The purpose of the `Migration` class in handling schema changes.

<SwmSnippet path="/src/sentry/db/postgres/creation.py" line="8">

---

# The role of `_execute_create_test_db` function

The `_execute_create_test_db` function is used to create a test database. It checks for exceptions related to duplicate databases, which is crucial in tracking schema changes. If a database already exists, it either cancels the tests or raises an exception, depending on the `keepdb` parameter.

```python
    def _execute_create_test_db(self, cursor, parameters, keepdb=False):
        """
        This is just copied from the base class and should behave the same. The only difference is
        that as well as checking `pgcode` we also do string matching on the Exception. This is to
        work around an issue where `pgcode` is missing when we run tests.
        """
        try:
            # Explicitly skip the overridden `_execute_create_test_db` and just call the one from
            # its superclass
            super(DatabaseCreation, self)._execute_create_test_db(cursor, parameters, keepdb)
        except Exception as e:
            if (
                getattr(e.__cause__, "pgcode", "") != errorcodes.DUPLICATE_DATABASE
                and "DuplicateDatabase" not in str(e)
                and "already exists" not in str(e)
            ):
                # All errors except "database already exists" cancel tests.
                sys.stderr.write("Got an error creating the test database: %s\n" % e)
                sys.exit(2)
            elif not keepdb:
                # If the database should be kept, ignore "database already
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
