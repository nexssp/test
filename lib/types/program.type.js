const { dr, dg, di, error, dy } = require("@nexssp/logdebug");
const { yellow, green, bold, purple, yellowBG2, red } = require("@nexssp/ansi");
/* eslint-disable no-unused-vars */
const { nExec, nSpawn } = require("@nexssp/system");
const { camelCase } = require("@nexssp/extend/string");

function shouldNotContain(test, regE, options) {
  return should(arguments.callee.name, test, regE, options);
}

function shouldContain(test, regE, options) {
  return should(arguments.callee.name, test, regE, options);
}

function checkExitCode(exitCode, result) {
  return result.exitCode === exitCode;
}

let previousResult;

function should(
  fname,
  test,
  regE,
  { chdir, nxsInspect, stopOnError = false, testFunction = "nExec" } = {}
) {
  let r, data;
  if (test == null) {
    //YES NULL as STRING
    if (!previousResult) {
      console.error("You need to specify REGEXP or STRING for the first test.");
      /* eslint-disable no-process-exit */
      process.exit();
    }
    dg(`Using cached result of previous command: ${bold(process.testTest)}`);
    data = previousResult;
  } else {
    // out(`${red(bright(test))} `);
    // logToFile(` >>>>>>> ${test} <<<<<<<`);
    // data = previousResult = exe(test);
    // We make sure there are no terminal colors signs as tests fails..
    if (chdir) {
      dg(`Set folder location in options: ${bold(chdir)}`);
    } else {
      dy(`No folder to change the location. process.cwd()`, process.cwd());
    }
    let functionForExe;
    switch (testFunction) {
      case "nExec":
        functionForExe = nExec;
        break;
      case "nSpawn":
      default:
        functionForExe = nSpawn;
        break;
    }

    // for nSpawn we pass full command like: nexss Id --debug. We are not separating args
    const result = functionForExe(test, { cwd: chdir });

    // Result is with r.exitCode
    r = result.stdout + result.stderr;
    // Check exitCode if specified
    if (arguments[3] && arguments[3].exitCode) {
      if (!checkExitCode(arguments[3].exitCode, result)) {
        dr(
          `Exit Code does not match: SHOULD BE: ${arguments[3].exitCode}!= RECEIVED: ${result.exitCode}`
        );
        if (!r.stdout && !r.stderr) {
          console.error(r);

          error(bold(`Node.js version: ${process.version}`));
        } else {
          console.log("output stdout:");
          console.log(r.stdout);
          console.log("output stderr:");
          console.log(r.stderr);

          error(bold(`Node.js version: ${process.version}`));
        }

        return false;
      } else {
        // if (!data) {
        //   result true;
        // }
      }
    } else if (result.exitCode !== 0) {
      console.log(
        yellowBG2(
          red(bold(`Exit Code should be 0. Now it is: ${result.exitCode}`))
        )
      );

      console.log("output stdout:");
      console.log(result.stdout);
      console.log("output stderr:");
      console.log(result.stderr);
      error(bold(`Node.js version: ${process.version}`));

      if (stopOnError) {
        error(
          "Stop on error is enabled. STOPPED. To continue all tests remove --stopOnError"
        );
        process.exit(0);
      }

      return false;
    }
    data = previousResult =
      r && r.replace
        ? r.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ""
          )
        : r;
  }

  dg(`>>> ${camelCase(fname)}: ${bold(green(regE))}`);
  let result, result2, result3, match;

  if (data) {
    data = data.trim();
    if (regE instanceof RegExp) {
      result3 = regE.test(data);
    } else {
      let regExp = new RegExp(regE, "i");
      match = regExp.exec(data);
      result = match && match.length > 1;
      result2 = data && data.includes(regE);
    }
  }

  let title = "contains";
  if (fname === "shouldNotContain") {
    result = match && !result;
    result2 = !result2;
    result3 = !result3;
  }

  // out("Results: ", result, result2, result3);

  // out(result);
  // out(result2);
  if (result && !(regE instanceof RegExp)) {
    // out(magenta(bright("TEST OK!\n")));
    // console.error(yellow(data));
    return match;
  } else if (result2 && !(regE instanceof RegExp)) {
    // out(magenta(bright("TEST OK!\n")));
    // console.error(yellow(data));
    return data;
  } else if (result3) {
    // out(magenta(bright("TEST OK!\n")));
    // console.error(yellow(data));
    return data;
  }

  //   console.error(
  //     red(bright(`=======================================================`))
  //   );

  // Highlight the string which should not be there
  if (fname === "shouldNotContain") {
    data = data.replace(regE, bold(purple(regE)));
  }

  if (!data) {
    dr(`But is empty.`);
    dr(
      `Maybe try run the function which couse the issue directly from Nexss Programmer.\n${green(
        bold(test)
      )}`
    );
  } else {
    dr(bold(`But ${title}: `));
    di(data);
    if (nxsInspect) {
      error(yellow(bold("INSPECT: ")));
      console.log(require("util").inspect(data));
    }
  }

  // logToFile(require("util").inspect(data));

  dr(bold(`=======================================================`));

  dr(bold("process.cwd()", process.cwd()));
  if (stopOnError) {
    error(
      "Stop on error is enabled. STOPPED. To continue all tests remove --stopOnError"
    );
    process.exit(0);
  }
}

function test2(ext) {
  const c = `nexss randomfile${ext}`;
  // out(`Test2: ${c}`);
  return c;
}

module.exports = {
  shouldContain,
  shouldNotContain,
};
