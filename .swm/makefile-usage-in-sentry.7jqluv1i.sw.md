---
title: Makefile Usage in Sentry
---
This document provides a detailed explanation of how the Makefile is used in the Sentry repository. It will cover the various commands and their purposes within the Makefile.

<SwmSnippet path="/Makefile" line="4">

---

# Makefile Commands

These lines define the commands that can be run with the Makefile. Each command corresponds to a script in the `./scripts/do.sh` file. The `@` symbol before the script path suppresses the command from being printed in the terminal, making the output cleaner.

```
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
upgrade-pip \
prerequisites \
setup-git-config :
```

---

</SwmSnippet>

<SwmSnippet path="/Makefile" line="30">

---

# Build Commands

These lines define the commands for building various parts of the application. For example, `build-js-po` checks the node version, creates a build directory, removes the babel-loader cache, and runs the webpack build for acceptance tests. Each command is associated with a script or a series of commands that are executed when the command is run.

```
build-js-po: node-version-check
	mkdir -p build
	rm -rf node_modules/.cache/babel-loader
	SENTRY_EXTRACT_TRANSLATIONS=1 $(WEBPACK)

build-spectacular-docs:
	@echo "--> Building drf-spectacular openapi spec (combines with deprecated docs)"
	@OPENAPIGENERATE=1 sentry django spectacular --file tests/apidocs/openapi-spectacular.json --format openapi-json --validate --fail-on-warn

build-deprecated-docs:
	@echo "--> Building deprecated openapi spec from json files"
	yarn build-deprecated-docs

build-api-docs: build-deprecated-docs build-spectacular-docs
	@echo "--> Dereference the json schema for ease of use"
	yarn deref-api-docs

watch-api-docs:
```

---

</SwmSnippet>

&nbsp;

*This is an auto-generated document by Swimm AI 🌊 and has not yet been verified by a human*

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGVtby1zZW50cnklM0ElM0Fzd2ltbWlv" repo-name="demo-sentry"><sup>Powered by [Swimm](/)</sup></SwmMeta>
