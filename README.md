# @nexssp/test

Testing library, easy, many ways to accomplish testing..

![image](https://user-images.githubusercontent.com/53263666/119671493-17b43a00-be3a-11eb-82d7-99cd2a819c75.png)

- **NEW** new function **getNewTestFolder**, **createNewTestFolder**

```js
const { createNewTestFolder } = require("@nexssp/test");
const testFolder = createNewTestFolder();
```

- **NEW** file types:

- **\*.nexss-assert.js** - create files with extension .nexss-assert.js and put testing there .. You can use there also **great NodeJS assert library**. For more please look at compare function test in this repository `tests\compare.nexss-assert.js`. Results from this type are also taken to the overall statistics of the **@nexssp/test**

```js
// compare.nexss-assert.js
const assert = require("assert"); // GREAT NodeJS library for testing
const obj1 = { x: 1, y: { z: 1 } };
const obj2 = { x: 1, y: { z: 11 } };

assert.deepStrictEqual(obj1, obj2);
```

- **NEW** File checking exists, content

New tests: **fileExists**, **notFileExists**, **fileHasContent**, **notFileHasContent**

```js
// Basic Example
{
  title: "File should have content",
  type: "fileHasContent",
  params: ["myfilename.txt","content in the file"],
},
```

- **NEW** - now you can also pass functions!

```js
// Advanced Example (use of function): test creates file and test for its content.
{
  title: "File should have content",
  type: "fileHasContent",
  params: [
    () => {
      const filename = "xxx.txt";
      const _fs = require("fs");
      _fs.writeFileSync(filename, "works!");
      return filename;
    },
    "works!",
  ],
},
```

- Another example of using functions

```js
// Example of the test with function
{
  type: "equal",
  params: [
    () => { // function to check (function MUST return value to check)
      const os = require("@nexssp/os");
      return os.name();
    },
    process.platform === "win32" // check the result by regular expression (or string)
      ? /(?:Windows)/
      : /(?:Ubuntu|Alpine|somethingelse)/,
  ],
}
```

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

## Test types

### Program types

- **shouldContain** - is used for cli command - **default** if type is not specified,
- **shouldNotContain** - the same as above but negative of result.

```js
nexsstests: [
    {
      // it will run command nexss and compare with the specified regexp.
      params: ["nexss", /"nexss":"(\d).(\d*).(\d*)"/,{
        exitCode:1, // if not specified 0 will be checked
        // chdir: "MyTestProject", // only once will change dir
        keepchdir: "MyTestProject", // will keep changing dir on the next tests in that file.
      }],

    },
],
```

- **equal**, **match** - is used to compare values. (also you can use regular expression, see above example)
- **notEqual**, **notMatch** - negative of equal, match

```js
nexsstests: [
  {
    title: "Should be equal", // optional / if not exists param[0] will be used for title.
    type: "equal",
    params: ["XXXX", /XXXX/],
  },
];
```

## Difference between .nexss-test.js and nexss-assert.js tests

### Example of .nexss-test.js

.nexss-test.js have more automatic things done like create test folder

```js
const commandBinPath = require("path").resolve(
  __dirname,
  "../bin/nexssp-command.js"
);

module.exports = {
  nexsstests: [
    {
      type: "shouldContain",
      params: [`node ${commandBinPath}`, /add.*command.*delete.*list.*/s],
    },
  ],
};
```

### Example of .assert-test.js

This example assert test is doing exacly the same as above \*.nexss-test.js. As you can see you have more control here on what is done. It is really up to you how you will use them.

Assert test are just program, but there can be used for example great NodeJS library **assert**. But you can have a choice what you want to use it there. But these files are also taken to the overall statistics of **@nexss/test**

```js
const assert = require("assert");
const { nSpawn } = require("@nexssp/system");

process.chdir(__dirname);
const commandBinPath = require("path").resolve("../bin/nexssp-command.js");

// We create test dolder
const { createNewTestFolder } = require("@nexssp/test");
const testFolder = createNewTestFolder();
console.log(`@test: ${testFolder}`);
process.chdir(testFolder);
// Default help
const result1 = nSpawn(`node ${commandBinPath}`);
assert.match(result1.stdout, /add.*command.*delete.*list.*/s);
```

## More Examples

- For more see Nexss Programmer's tests folder in the other **@nexssp** packages..
