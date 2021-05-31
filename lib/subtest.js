const { template } = require("@nexssp/extend/string");
const subtest = (allTests, { file, value, chdir, stopOnError } = {}) => {
  const testTypes = require("./types");
  const { error, dbg, dg, dy, header, dr } = require("@nexssp/logdebug");
  const { yellow, bold, magenta, green } = require("@nexssp/ansi");

  const path = require("path");
  const { inspect } = require("util");
  if (!allTests.nexsstests) {
    error("check:", file);
    /* eslint-disable no-process-exit */
    process.exit(1);
  }
  let totalOk = 0;
  let totalFailed = 0;
  let keepchdir = null; // To keep chdir option. it is keepchdir
  const rrr = allTests.nexsstests.map((subtestItem) => {
    subtestItem.file = file;

    if (subtestItem.title) {
      subtestItem.title =
        (subtestItem.title.indexOf("$") === -1 || !value) &&
        !subtestItem.notEval &&
        !allTests.notEval
          ? subtestItem.title
          : evalTS(subtestItem.title, value); //evalTS(subtestItem.title, topTest);
    } else {
      subtestItem.title = subtestItem.params[0];
    }

    //   subtestItemResult.topTest = topTest;

    const typeOfTest =
      subtestItem.type || allTests.defaultType || "shouldContain";
    // Below is not needed ? shouldContain is not the best for default though
    //   if (!typeOfTest) {
    //       subtestItem.testType =
    //         `Test type: ${typeOfTest} has not been found.` +
    //         `DEV: Please consider add testType, and do module.exports={yourtestype}.`;
    //       return subtestItem;
    //     }
    subtestItem.testType = typeOfTest;

    const typeOfTestFunction =
      subtestItem.testFunction || allTests.defaultTestFunction || "nExec";

    if (!subtestItem.params) {
      error("check:", file);
      error("No parames on test", subtestItem.title);
      /* eslint-disable no-process-exit */
      process.exit(1);
    }

    const testBody = `${subtestItem.params[0]} ${typeOfTest} -> ${subtestItem.params[1]}`;
    header();
    console.log(bold(green(`${value}, ${subtestItem.title}`)));
    console.log(`FILE:  ${magenta(bold(file))}`);

    let titleEval;
    if (allTests.notEval || subtestItem.notEval) {
      titleEval =
        require("util").inspect(subtestItem.params[0]) +
        ", value not evaluated: " +
        value;
    } else {
      titleEval = evalTS(subtestItem.params[0], value);
    }

    dbg(
      `${bold(yellow(titleEval))}\n${bold(yellow(typeOfTest))}  ==>\n${bold(
        subtestItem.params[1]
      )}`,
      subtestItem.params[2] ? bold(inspect(subtestItem.params[2])) : ""
    );

    // Keep changing directory for the next tests..
    if (subtestItem.params[2]) {
      if (subtestItem.params[2].keepchdir) {
        keepchdir = subtestItem.params[2].keepchdir;
        dy(bold(`Set keepchdir: ${keepchdir}`));
        subtestItem.params[2].chdir = keepchdir;
      }
    }

    //
    if (chdir && keepchdir) {
      if (!path.isAbsolute(keepchdir)) {
        chdir += `/${keepchdir}`;
      }
      keepchdir = chdir;
    }

    if (!chdir && keepchdir) {
      chdir = keepchdir;
    }

    dy(bold(`chdir is: `, chdir));
    let testExecuteResult;
    try {
      testExecuteResult = testTypes[`${typeOfTest}`](
        ...subtestItem.params.map((p) => {
          if (
            (p !== null && typeof p === "object") ||
            allTests.notEval ||
            subtestItem.notEval
          ) {
            return p;
          } else {
            return evalTS(p, value);
          }
        }),
        { chdir, testFunction: typeOfTestFunction }
      );
    } catch (e) {
      dr(
        bold(
          "Error:\n",
          `Check if test type exists in the current test: \nFILE: ${file}\nTEST: ${subtestItem.title}`
        )
      );
      console.error(e);
      process.exit(1);
    }

    subtestItem.result = testExecuteResult;
    subtestItem.testBody = testBody;
    if (!testExecuteResult) {
      error(bold("FAILED: " + file));
      error(bold("title: " + subtestItem.title));
      error(
        bold(
          subtestItem.params.reduce((f, toFlat) => {
            f += `\n${inspect(toFlat)}`;
            return f;
          }, "")
        )
      );
      subtestItem.ok = false;
      totalFailed++;
      if (stopOnError) {
        process.exit(1);
        // below didnt work
        // throw new Error(
        //   "Stop on Error. To disable and go all tests remove --stopOnError option."
        // );
      }
    } else {
      dg(bold("OK.\n"));
      subtestItem.ok = true;
      totalOk++;
    }
    return subtestItem;
  });

  return { file, results: rrr, totalOk, totalFailed };
};

module.exports = { subtest };

function evalTS(v, uniqueTestValue) {
  // uniqueTestValue must be here!!!
  // Below needs tobe here for eval.
  // Add more here vars if needed for eval of titles.
  // return v.interpolate({ uniqueTestValue });
  try {
    return template(v, { uniqueTestValue });
  } catch (er) {
    warn(
      bold(
        "===> EvalTS failed" +
          "\nTry to disable evaluation of command.  allTests.notEval || subtestItem.notEval\n" +
          er +
          "\nBut failed expression will be compared."
      )
    );
    return v;
  }
}
