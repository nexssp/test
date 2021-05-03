const testTypes = require("./types");
const { error, dbg, dg, dr, dy, header } = require("@nexssp/logdebug");
const { yellow, bold, magenta } = require("@nexssp/ansi");

const subtest = (allTests, { file, value, display = false, chdir } = {}) => {
  if (!allTests.nexsstests) {
    error("check:", file);
    process.exit(1);
  }
  let totalOk = 0;
  let totalFailed = 0;

  const rrr = allTests.nexsstests.map((subtestItem) => {
    subtestItem.file = file;
    subtestItem.title =
      subtestItem.title.indexOf("$") === -1 || !value
        ? subtestItem.title
        : evalTS(subtestItem.title, value); //evalTS(subtestItem.title, topTest);

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

    header(`TEST FOR:  ${magenta(value)}, ${yellow(subtestItem.title)}`);

    dbg(
      `${bold(yellow(evalTS(subtestItem.params[0], value)))}\n${bold(
        yellow(typeOfTest)
      )}  ==>\n ${bold(subtestItem.params[1])}`
    );

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
      dr(bold("FAILED.\n"));
      subtestItem.ok = false;
      totalFailed++;
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
