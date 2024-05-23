---
title: Getting started
---
This document will cover the process of getting started with the demo-sentry repository. We'll cover:

1. The purpose of the repo and its main functionalities.
2. Important documents to read from the repo.
3. How to run and debug the main parts of the repo.
4. How to contribute to the repo.

# Purpose and Main Functionalities of the Repo

The demo-sentry repository is used to demonstrate using Swimm. Its starting point is a clone of sentry. The documentation provided in the `.swm` folder is made available by Swimm, and is not official Sentry documentation. Swimm makes available this documentation for the purposes of evaluating the Swimm solution, and not for production purposes.

# Important Documents to Read

The 'Getting Started' guide in the docs-ui directory provides a detailed account of the UI system, including interactive examples and recommended use cases. It also includes a 'Changelog' page for the latest updates to the design and component system.

<SwmSnippet path="/setup.py" line="1">

---

# Running and Debugging the Repo

The `setup.py` file contains the build commands for the project. It checks the Python version, sets up the build commands, and defines the requirements for the project. The `SentrySDistCommand` and `SentryBuildCommand` classes define the build process.

```python
#!/usr/bin/env python

import os
import sys

python_version = sys.version_info[:2]

if python_version < (3, 8):
    sys.exit(f"Error: Sentry requires at least Python 3.8 ({python_version})")
if python_version != (3, 8):
    import logging

    logger = logging.getLogger()
    logger.warning(f"A Python version different than 3.8 is being used ({python_version})")


from distutils.command.build import build as BuildCommand

from setuptools import find_packages, setup
from setuptools.command.develop import develop as DevelopCommand
from setuptools.command.sdist import sdist as SDistCommand
```

---

</SwmSnippet>

<SwmSnippet path="/Makefile" line="1">

---

# Contributing to the Repo

The `Makefile` contains various commands for setting up the development environment, running tests, and linting the code. This is a good starting point for anyone looking to contribute to the project.

```
PIP := python -m pip --disable-pip-version-check
WEBPACK := yarn build-acceptance

bootstrap \
develop \
clean \
init-config \
run-dependent-services \
drop-db \
create-db \
apply-migrations \
reset-db \
setup-apple-m1 \
setup-git \
node-version-check \
install-js-dev \
install-py-dev :
	@./scripts/do.sh $@

build-platform-assets \
direnv-help \
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
