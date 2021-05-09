const testTypes = require("./types");
const { error, dbg, dg, dr, dy, header } = require("@nexssp/logdebug");
const { yellow, bold, magenta, green } = require("@nexssp/ansi");
const path = require("path");
const subtest = (
  allTests,
  { file, value, display = false, chdir, stopOnError } = {}
) => {
  if (!allTests.nexsstests) {
    error("check:", file);
    process.exit(1);
  }
  let totalOk = 0;
  let totalFailed = 0;
  let keepchdir = null; // To keep chdir option. it is keepchdir
  const rrr = allTests.nexsstests.map((subtestItem) => {
    subtestItem.file = file;

    if (subtestItem.title) {
      subtestItem.title =
        subtestItem.title.indexOf("$") === -1 || !value
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

    if (!subtestItem.params) {
      error("check:", file);
      error("No parames on test", subtestItem.title);
      process.exit(1);
    }

    const testBody = `${subtestItem.params[0]} ${typeOfTest} -> ${subtestItem.params[1]}`;
    header();
    console.log(bold(green(`${value}, ${subtestItem.title}`)));
    console.log(`FILE:  ${magenta(bold(file))}`);

    dbg(
      `${bold(yellow(evalTS(subtestItem.params[0], value)))}\n${bold(
        yellow(typeOfTest)
      )}  ==>\n ${bold(subtestItem.params[1])}`,
      bold(subtestItem.params[2])
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

    const testExecuteResult = eval(testTypes[typeOfTest])(
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
      { chdir }
    );

    subtestItem.result = testExecuteResult;
    subtestItem.testBody = testBody;
    if (!testExecuteResult) {
      error(bold("FAILED: " + file));
      error(bold("title: " + subtestItem.title));
      error(
        bold(
          subtestItem.params.reduce((f, toFlat) => {
            f += `\n${toFlat}`;
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
  // value must be here!!!
  // Below needs tobe here for eval.
  // Add more here vars if needed for eval of titles.
  return eval("`" + v + "`");
}
