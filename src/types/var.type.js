const { compare } = require("./compare");

function isFunction(f) {
  return f && {}.toString.call(f) === "[object Function]";
}
function equal(test, regE) {
  // let result;
  if (isFunction(test)) {
    test = test();
    console.log("Result of function: ", test);
  }

  return compare(test, regE);
}

function notEqual(test, regE) {
  return !equal(test, regE);
}

module.exports = { equal, notEqual };
