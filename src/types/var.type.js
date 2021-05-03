function equal(test, regE) {
  let result;
  if (regE instanceof RegExp) {
    result = regE.test(test);
    // process.exit(1);
  }
  if (test === regE) {
    return true;
  } else {
    let regExp = new RegExp(regE, "i");
    result = regExp.exec(test);
    // testMatch = match && match.length > 1;
    if (result && test === result[0]) {
      return true;
    }
    // result = test && test.includes(regE);
  }
  return result;
}

function notEqual(test, regE) {
  return !equal(test, regE);
}

module.exports = { equal, notEqual };
