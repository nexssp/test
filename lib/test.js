const path = require("path");
const { bold } = require("@nexssp/ansi");
const { error, info } = require("@nexssp/logdebug");
const { testOne } = require("./testOne");
const { nSpawn } = require("@nexssp/system");
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

  glob = glob || "./*.nexss-test.js";
  let p = `${sourceFolder}${glob}`.replace(/\\/g, "/");

  // let p_assert = `${sourceFolder}**/*.nexss-assert.js`.replace(/\\/g, "/");
  let p_assert = `${p.replace(/nexss-test.js/g, "nexss-assert.js")}`;

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

  // for (const assertF of assert_files) {
  //   await givePrizeToPlayer(player);
  // }
  const sleep = (n) => new Promise((res) => setTimeout(res, n));
  const allAssertions = await Promise.all(
    assert_files.map(async (f) => {
      const x = nSpawn(`${process.argv[0]} ${processCWD}/${f}`, {
        stdio: ["pipe", 1, 2],
      });
      if (x.exitCode === 0) {
        return { file: f, results: "ok", totalOk: 1, totalFailed: 0 };
      } else {
        error(bold("Error in assertion test: ", f));
        console.error(x.stderr);

        return { file: f, results: x.stderr, totalOk: 0, totalFailed: 1 };
      }
    })
  );

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
