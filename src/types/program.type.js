const { exe } = require("../lib");
const { dr, dg, di, error } = require("@nexssp/logdebug");
const { yellow, green, bold, purple } = require("@nexssp/ansi");

function shouldNotContain(test, regE, options) {
  return should(arguments.callee.name, test, regE, options);
}

function shouldContain(test, regE, options) {
  return should(arguments.callee.name, test, regE, options);
}

function should(
  fname,
  test,
  regE,
  { chdir, nxsInspect, stopOnError = false } = {}
) {
  // if (chdir) {
  //   dg(`Changing directory from ${process.cwd()} -> ${chdir}`);
  //   process.chdir(chdir);
  // }

  if (test == "null") {
    //YES NULL as STRING
    if (!process.testData) {
      console.error("You need to specify REGEXP or STRING for the first test.");
      process.exit();
    }
    dg(`Using cached result of previous command: ${bold(process.testTest)}`);
    data = process.testData;
  } else {
    process.testTest = test;
    // out(`${red(bright(test))} `);
    // logToFile(` >>>>>>> ${test} <<<<<<<`);
    // data = process.testData = exe(test);
    // We make sure there are no terminal colors signs as tests fails..
    dg(`Changing folder ${bold(chdir)}`);
    const r = exe(test, { cwd: chdir });
    data = process.testData =
      r && r.replace
        ? r.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ""
          )
        : r;
  }

  // out("return: ", test, data);

  //   out(`>>> ${camelCase(fname)}: ${bright(green(regE))}`);
  let result, result2, result3, match;
  // out(data);
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
  if (result && !regE instanceof RegExp) {
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
    error("Stop on error is enabled. STOPPED");
    process.exit(0);
  }
}

function test2(ext) {
  const c = `nexss randomfile${ext}`;
  out(`Test2: ${c}`);
  return c;
}

module.exports = {
  shouldContain,
  shouldNotContain,
};
