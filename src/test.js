const path = require("path");
const { bold } = require("@nexssp/ansi");
const { error } = require("@nexssp/logdebug");
const { testOne } = require("./testOne");
const testAll = async (
  sourceFolder = "./src/",
  { glob, display = false, ignore = [] } = {}
) => {
  if (!require("fs").existsSync(sourceFolder)) {
    error(`Source folder does not exist. ${sourceFolder}`);
    process.exit(1);
  }

  // We make sure node_modules is not counted
  if (!ignore.includes("!**/node_modules")) {
    ignore = ignore.concat("!**/node_modules");
  }

  glob = glob || "./*_nexss-test.js";

  if (!sourceFolder.endsWith("/") && !sourceFolder.endsWith("\\")) {
    error("Source folder must contain at the end '/' eg: ./src/");
    process.exit(1);
  }

  const fg = require("fast-glob");
  let p = `${sourceFolder}${glob}`.replace(/\\/g, "/");

  // Above we add to ignore: "!**/node_modules"
  const files = await fg([p], { ignore });

  if (files.length === 0) {
    error(
      bold(`No test files has been found in the ${path.resolve(sourceFolder)}`)
    );
    error(bold("Please remove testing command or add/check testing files."));
    process.exit(1);
  }
  const processCWD = process.cwd();
  const allPromises = await Promise.all(
    files.map(async (f) => testOne(`${processCWD}/${f}`, { display }))
  );

  return allPromises;
};

module.exports = { testAll };
