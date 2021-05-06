# @nexssp/test

Just **FAST**, basic testing.

**NOTE:** This module is **experimental!** Use only with caution.

## Installation

```sh
npm i @nexssp/test -D # install for devDependencies
```

## Example commands

```sh
nexssp-test --select=project # will only perform project.nexss-test.js
nexssp-test --ignore=languages # which should be ignored, can be array.
nexssp-test --ignore=languages --dry # not running tests, displays only test files which can be run without --dry option
nexssp-test --select=languages --debug # displays all data which are happening during tests. great dev helper.
```

## Package.json

Below example of testing

```json
"scripts": {
    "test": "nexssp-test --ignore=languages", // will ignore languages.nexss-test.js
    "test:list": "nexssp-test --dry", // will only display list of test files
    "test:languages:verbose": "nexssp-test --select=languages --verbose", // during test will display
    "test:all:long": "nexssp-test",
    "prepare": "npm test && npm run nexss:build",
    "nexss:build": "npx @nexssp/min@1.0.6"
  },
```

## Examples

- See Nexss Programmer's tests folder **2.4.0+**
