const { compare } = require("./compare");

function isFunction(f) {
  return f && {}.toString.call(f) === "[object Function]";
}
const { bold } = require("@nexssp/ansi");
const _log = require("@nexssp/logdebug");

function equal(test, regE) {
  // let result;
  if (isFunction(test)) {
    test = test();
    _log.dc(bold("Result of function:"), bold(test));
  }

  return compare(test, regE);
}

function notEqual(test, regE) {
  return !equal(test, regE);
}

module.exports = { equal, notEqual };
