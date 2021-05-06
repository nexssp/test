# @nexssp/test

Just **FAST**, basic testing and code validator.

**NOTE:** This module is **experimental!** It works, but may have some issues.

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
    "test": "nexssp-test --ignore=languages # will ignore languages.nexss-test.js",
    "test:selected": "nexssp-test --ignore=languages --select=platform --debug # now will display with the details",
    "test:continue": "nexssp-test --ignore=languages --continueOnError --debug # will not stop on errors",
    "test:list": "nexssp-test --dry # just display files which are selected. ommiting ignored ones",
    "test:languages": "nexssp-test --select=languages --debug",
    "test:all:long": "nexssp-test",
  },
```

## Examples

- See Nexss Programmer's tests folder **2.4.0+**
