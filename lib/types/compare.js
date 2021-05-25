const _log = require("@nexssp/logdebug");
const { bold } = require("@nexssp/ansi");
const { inspect } = require("util");

function isFunction(f) {
  return f && {}.toString.call(f) === "[object Function]";
}

const compare = (val1, val2, optionalMessages) => {
  if (typeof val2 === "boolean" && val2 === true) {
    if (val1 && val1.length === 0) {
      return false;
    }
  }

  if (isFunction(val1)) {
    val1 = val1();
    _log.dc(bold("Result of function: @compare val1"), bold(inspect(val1)));
    // console.log("result function of val1: ", val1, optionalMessages);
    if (optionalMessages) {
      console.log(optionalMessages);
    }
  }

  if (isFunction(val2)) {
    val2 = val2();
    _log.dc(bold("Result of function: @compare val2"), bold(inspect(val2)));
    // console.log("result function of val2: ", val2, optionalMessages);
    if (optionalMessages) {
      console.log(optionalMessages);
    }
  }

  if (val2 instanceof RegExp) {
    return val2.test(val1);
    // process.exit(1);
  } else if (Object.prototype.toString.call(val2) !== "[object String]") {
    return JSON.stringify(val1) === JSON.stringify(val2);
  } else if (val1 === val2) {
    return true;
  }
};

module.exports = { compare, isFunction };
