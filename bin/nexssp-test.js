#!/usr/bin/env node
const { testAll } = require("../");

const { header, ok, info, error } = require("@nexssp/logdebug");
const { bold, yellow, red, green, magenta } = require("@nexssp/ansi");
const fs = require("fs");
const path = require("path");
(async () => {
  const params = require("minimist")(process.argv.slice(2));
  const pkg = require("../package.json");
  if (params._[0] === "help") {
    console.log(
      `   ${bold(pkg.name)}@${pkg.version}, Node.js: ${process.version}`
    );
    console.log(`     --select - select name to test. Can be multiple.`);
    console.log(`     --ignore - select ignore to test. Can be multiple.`);
    console.log(`     --debug - will show details about errors.`);
    console.log(
      `     --continueOnError - It will continue with the tests, and will show details at the end.`
    );
    /* eslint-disable no-process-exit */
    process.exit(0);
  }

  const from = params._[0] || "./";
  // const glob = process.argv[3] || "**/*.nexss-test.js";
  let glob = params._[1] || "**/*.nexss-test.js";
  let ignore = [];

  if (params.select) {
    if (Array.isArray(params.select)) {
      // glob = params.select.map((e) => "**/*" + e + "*.nexss-test.js");
      glob = "**/*{" + params.select.join(",") + "}*.nexss-test.js";
    } else {
      glob = "**/*" + params.select + "*.nexss-test.js";
    }
  } else {
    glob = "**/*.nexss-test.js";
  }

  if (Array.isArray(params.ignore)) {
    const addIgnore = "!**/*{" + params.ignore.join(",") + "}*.nexss-test.js";
    ignore = ignore.concat(addIgnore);
  } else {
    // ignore = ignore.concat("!**/" + params.ignore + ".nexss-test.js");
    ignore = ignore.concat("!**/" + params.ignore + ".nexss-test.js");
  }

  header(
    `Starting ${bold(pkg.name)}@${bold(green(pkg.version))} module:`,
    path.resolve(from)
  );
  info("Starting testing..");
  let result;
  const timeMark = bold(
    `@nexssp/test: ${magenta("v" + pkg.version)}, Node.js: ${process.version}`
  );
  console.time(timeMark);

  // Below remove 1 for cache results (development)
  const file = require("path").resolve("./cache.nexss-test.json");
  if (!params.cache || !fs.existsSync(file)) {
    result = await testAll(from, {
      glob,
      ignore,
      dry: params.dry,
      // default stop on error
      stopOnError: !params.continueOnError,
    }).catch((e) => console.error("There was an error during tests:", e));
    if (!Array.isArray(result)) {
      // Dry?
      return;
    } else {
      result.flat();
    }

    fs.writeFileSync(file, JSON.stringify(result, null, 2));
  } else {
    result = require(file);
  }

  result = result.flat();

  let totalFailed = 0;
  let totalOk = 0;

  result.forEach((r) => {
    if (r) {
      totalOk += r.totalOk;
      totalFailed += r.totalFailed;

      if (r.totalFailed) {
        error(
          `${bold(yellow(r.file))}  ${green("OK: " + r.totalOk)} / ${
            r.totalFailed > 0
              ? red(bold(`Failed: ${r.totalFailed}`))
              : `Failed: 0`
          } `
        );
        console.log(r.results);
      } else {
        ok(
          `${bold(yellow(r.file))}  ${green("OK: " + r.totalOk)} / ${
            r.totalFailed > 0
              ? red(bold(`Failed: ${r.totalFailed}`))
              : `Failed: 0`
          } `
        );
      }
    }
  });
  if (totalFailed > 0) {
    error(
      bold(
        `@nexssp/test -> done, but failed: ${totalFailed} of ${
          totalFailed + totalOk
        } all tests.`
      )
    );
    process.exitCode = 1;
  } else {
    // +totalFailed doesnt make sense here
    ok(bold(`@nexssp/test -> done. Total ${totalOk} tests.`));
  }

  console.timeEnd(timeMark);
})();
//    const percentage = 100 - (compressed.code.length / code.length) * 100;
// const percentageRounded = Math.round(percentage, 2);
//
