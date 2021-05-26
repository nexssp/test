const path = require("path");
const { bold } = require("@nexssp/ansi");
const { error, info } = require("@nexssp/logdebug");
const { testOne } = require("./testOne");
const testAll = async (
  sourceFolder = "./src/",
  { glob, assertOnly, display = false, ignore = [], dry, stopOnError } = {}
) => {
  if (!require("fs").existsSync(sourceFolder)) {
    warn(`Source folder does not exist. ${sourceFolder}.`);
    /* eslint-disable no-process-exit */
    if (sourceFolder === "./src/") {
      info('Checking "./lib/"');
      sourceFolder = "./lib/";
      if (!require("fs").existsSync(sourceFolder)) {
        error(`${sourceFolder} also not exist.`);
      }
    } else {
      process.exit(1);
    }
  }

  // We make sure node_modules is not counted
  if (!ignore.includes("!**/node_modules")) {
    ignore = ignore.concat("!**/node_modules");
  }

  if (!sourceFolder.endsWith("/") && !sourceFolder.endsWith("\\")) {
    error("Source folder must contain at the end '/' eg: ./src/");
    /* eslint-disable no-process-exit */
    process.exit(1);
  }

  glob = glob || "./*_nexss-test.js";
  let p = `${sourceFolder}${glob}`.replace(/\\/g, "/");
  let p_assert = `${sourceFolder}**/*.nexss-assert.js`.replace(/\\/g, "/");

  const fg = require("fast-glob");
  // Above we add to ignore: "!**/node_modules"

  const files = !assertOnly ? await fg([p], { ignore }) : [];
  const assert_files = await fg([p_assert], { ignore });

  if (dry) {
    console.log("Standard Tests:");
    console.log(files);
    console.log("Assert Tests:");
    console.log(assert_files);
    return;
  }

  if (files.length === 0 && assert_files.length === 0) {
    error(
      bold(`No test files has been found in the ${path.resolve(sourceFolder)}`)
    );
    error(bold("Please remove testing command or add/check testing files."));
    /* eslint-disable no-process-exit */
    process.exit(1);
  }
  const processCWD = process.cwd();
  const allPromises = await Promise.all(
    files.map(async (f) =>
      testOne(`${processCWD}/${f}`, { display, stopOnError })
    )
  );

  const allAssertions = assert_files.map((f) => {
    try {
      require(`${processCWD}/${f}`);
      return { file: f, results: "ok", totalOk: 1, totalFailed: 0 };
    } catch (e) {
      error(bold("Error in assertion test: ", f));
      console.error(e);
      return { file: f, results: e, totalOk: 0, totalFailed: 1 };
    }
  });

  return [...allPromises, ...allAssertions];
};

function getNewTestFolder(testPathFolder) {
  const tempFolder = testPathFolder ? testPathFolder : require("os").tmpdir();
  const testFolderName = `Nexss-test-${Math.random()
    .toString(36)
    .substring(2)}`;
  return path.join(tempFolder, testFolderName);
}

function createNewTestFolder(testPathFolder) {
  const testPath = getNewTestFolder(testPathFolder);
  const _fs = require("fs");
  if (!_fs.existsSync(testPath)) {
    _fs.mkdirSync(testPath);
  }

  return testPath;
}

const { compare, isFunction } = require("../lib/types/compare");

module.exports = {
  testAll,
  getNewTestFolder,
  createNewTestFolder,
  compare,
  isFunction,
};
