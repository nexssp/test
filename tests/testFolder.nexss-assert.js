const assert = require("assert");
const { compare } = require("../src/types/compare");

const { createNewTestFolder } = require("../src/test");
const testFolder = createNewTestFolder();

assert.ok(compare(testFolder, /Nexss-test-/));

// createNewTestFolder
const tf = createNewTestFolder();
const _fs = require("fs");
assert.ok(_fs.existsSync(tf));
