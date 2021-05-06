#!/usr/bin/env node
const { testAll } = require("../");

const { header, ok, info, error } = require("@nexssp/logdebug");
const { bold, yellow, red, green } = require("@nexssp/ansi");
const fs = require("fs");
const path = require("path");
(async () => {
  const params = require("minimist")(process.argv.slice(2));

  if (params._[0] === "help") {
    const pkg = require("../package.json");

    console.log(`   ${bold(pkg.name)}@${pkg.version}`);
    console.log(`     --select - select name to test. Can be multiple.`);
    console.log(`     --ignore - select ignore to test. Can be multiple.`);
    console.log(`     --debug - will show details about errors.`);
    console.log(
      `     --continueOnError - It will continue with the tests, and will show details at the end.`
    );
    process.exit(0);
  }

  const from = params._[0] || "./";
  // const glob = process.argv[3] || "**/*.nexss-test.js";
  let glob = params._[1] || "**/*.nexss-test.js";
  let ignore = [];

  if (params.select) {
    if (Array.isArray(params.select)) {
      glob = params.select.map((e) => "**/*" + e + "*.nexss-test.js");
    } else {
      glob = "**/*" + params.select + "*.nexss-test.js";
    }
  } else {
    glob = "**/*.nexss-test.js";
  }

  if (!Array.isArray(params.ignore)) {
    ignore = ignore.concat("!**/" + params.ignore + ".nexss-test.js");
  } else {
    const addIgnore = params.ignore.map((e) => "!**/*" + e + "*.nexss-test.js");
    ignore = ignore.concat(addIgnore);
  }

  header("Starting @nexssp/test module:", path.resolve(from));
  info("Starting testing..");
  let result;
  console.time(bold("@nexssp/test"));

  // Below remove 1 for cache results (development)
  const file = require("path").resolve("./dev.json");
  if (!params.cache || !fs.existsSync(file)) {
    result = await testAll(from, {
      glob,
      ignore,
      dry: params.dry,
      // default stop on error
      stopOnError: !params.continueOnError,
    });
    if (!Array.isArray(result)) {
      // Dry?
      return;
    } else {
      result.flat();
    }

    fs.writeFileSync(file, JSON.stringify(result));
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

  console.timeEnd(bold("@nexssp/test"));
})();
//    const percentage = 100 - (compressed.code.length / code.length) * 100;
// const percentageRounded = Math.round(percentage, 2);
//
