const { bold, green, yellow } = require("@nexssp/ansi");
const { subtest } = require("./subtest");
const { error, header } = require("@nexssp/logdebug");
const path = require("path");
const fs = require("fs");
const testOne = (file, { startFromTest = 1, display = false } = {}) => {
  let selected = [];

  const testResult = { file };
  // Loading test definition
  let testsDef;
  testsDef = require(file);

  // For no values test (separate tests for each unique value)
  // We peform one with Nexss
  if (!testsDef.uniqueTestValues) {
    testsDef.uniqueTestValues = ["Nexss"];
  }

  try {
  } catch (e) {
    if (fs.existsSync(file)) {
      error(
        `File is there: ${bold(file)}, but it seems that it ${bold(
          "is not the correct " + yellow("nexss test")
        )} file.`
      );

      //   const vm = require("vm");
      //   const script = new vm.Script("var a =");
    } else {
      error(`File has not been found: ${file}.`);
    }
    error(bold("PROCESS CWD: ", process.cwd()));
    process.exit(1);
  }

  // Setup test from, to and which should be ommited
  // let startFrom = selected.length > 0 ? null : testsDef.startFrom;
  // let endsWith = selected.length > 0 ? null : testsDef.endsWith;
  let omit = selected.length > 0 ? null : testsDef.omit;

  // We need separate temporary folder for file operation
  // Later enable, disable.

  const allResultsTotal = testsDef.uniqueTestValues.reduce((f, value) => {
    const tempFolder = require("os").tmpdir();
    const testFolderName = `Nexss-test-${Math.random()
      .toString(36)
      .substring(7)}`;
    const testPath = path.join(tempFolder, testFolderName);
    testResult.testPath = testPath;

    if (!fs.existsSync(testPath)) {
      fs.mkdirSync(testPath);
    }

    // process.chdir(testPath);
    // TODO: Check below (evalTS doesn;t work without it??)

    // We can test uniqueTestValue for each test for example
    // For the Nexss Programmer we use it for each language
    // So we use extension as a value.
    header(`file: ${green(file)}`);
    const ss = subtest(testsDef, {
      startFromTest,
      file,
      value,
      chdir: testPath,
    });

    return f.concat(ss);
  }, []);

  return allResultsTotal;
};

module.exports = { testOne };
