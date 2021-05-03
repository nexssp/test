# @nexssp/test

Just **FAST**, basic testing.

**NOTE:** This module is **experimental!** Use only with caution.

## Installation

```sh
npm i @nexssp/test -D # install for devDependencies
```

## Package.json

Below example of testing

```json
"scripts": {
    "test": "nexssp-test --debug",
    "test:languages": "nexssp-test --selected=languages --debug",
    "test:all:long": "nexssp-test --selected=all",
    "prepare": "npm test && npm run nexss:build",
    "nexss:build": "npx @nexssp/min@1.0.6"
  },
```

## Examples

- See Nexss Programmer's tests folder **2.4.0+**
