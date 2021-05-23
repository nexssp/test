const path = require("path");
const { bold } = require("@nexssp/ansi");
const { error } = require("@nexssp/logdebug");
const { testOne } = require("./testOne");
const testAll = async (
  sourceFolder = "./src/",
  { glob, assertOnly, display = false, ignore = [], dry, stopOnError } = {}
) => {
  if (!require("fs").existsSync(sourceFolder)) {
    error(`Source folder does not exist. ${sourceFolder}`);
    /* eslint-disable no-process-exit */
    process.exit(1);
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
    console.log("Nexss Tests:");
    console.log(files);
    console.log("Nexss Tests:");
    console.log(assert_files);
    return;
  }

  if (files.length === 0 || assert_files.length === 0) {
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

module.exports = { testAll };
