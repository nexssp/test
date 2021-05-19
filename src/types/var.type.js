function isFunction(f) {
  return f && {}.toString.call(f) === "[object Function]";
}
function equal(test, regE) {
  // let result;
  if (isFunction(test)) {
    test = test();
    console.log("Result of function: ", test);
  }

  if (regE instanceof RegExp) {
    return regE.test(test);
    // process.exit(1);
  } else if (test === regE) {
    return true;
  }
}

function notEqual(test, regE) {
  return !equal(test, regE);
}

module.exports = { equal, notEqual };
