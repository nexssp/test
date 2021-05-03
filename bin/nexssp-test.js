#!/usr/bin/env node
const { testAll } = require("../");

const { header, ok, info, error } = require("@nexssp/logdebug");
const { bold, yellow, red, green } = require("@nexssp/ansi");
const fs = require("fs");
const path = require("path");
(async () => {
  // Get arguments from CLI
  const [, , ...args] = process.argv;
  const params = args.reduce(
    (f, tof) => {
      if (tof.startsWith("--")) {
        f[tof.substring(2).split("=")[0]] = tof.includes("=")
          ? tof.split("=")[1]
          : true;
      } else if (f._) {
        f._.push(tof);
      }

      return f;
    },
    { _: [] }
  );

  const from = params._[0] || "./";
  // const glob = process.argv[3] || "**/*.nexss-test.js";
  let glob = params._[1] || "**/*.nexss-test.js";
  let ignore = [];
  if (params.selected) {
    switch (params.selected) {
      case "all":
        // We take everything (by default they are disabled)
        // ignore = ignore.concat("!languages.nexss-test.js");
        break;
      case "languages":
        glob = "**/*" + params.selected + "*.nexss-test.js";
        break;
      default:
        glob = "**/*" + params.selected + "*.nexss-test.js";
        // By default languages are disabled (It is long time testing..)
        // Installing all compilers etc.
        ignore = ignore.concat("!languages.nexss-test.js");
        break;
    }
  }

  header("Starting @nexssp/test module:", path.resolve(from));
  info("Starting testing..");
  let result;
  console.time(bold("@nexssp/test"));

  // Below remove 1 for cache results (development)
  const file = require("path").resolve("./dev.json");
  if (!params.cache || !fs.existsSync(file)) {
    result = await testAll(from, { glob, ignore });
    result.flat();

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
