const _fs = require("fs");
const { compare, isFunction } = require("./compare");

function fileExists(file) {
  if (isFunction(file)) {
    file = file();
    console.log("Result of function and Passing to fileExists: ", file);
  }

  try {
    return _fs.existsSync(file);
  } catch (e) {
    console.error(`Error during fileExists check.. Checking file: ${file}`);
    return false;
  }
}

function notFileExists(test, regE) {
  return !fileExists(test, regE);
}

// if regE is bool and true will check if there is any content
// if regE is regexp or string will check accordingly

function fileHasContent(file, regE) {
  let test;

  if (isFunction(file)) {
    file = file();
    console.log("Result of function. Passing to fileExists: ", file);
  }

  try {
    test = _fs.readFileSync(file).toString();
  } catch (e) {
    console.error(`Error during fileHasContent check.. Checking file: ${file}`);
    return false;
  }

  return compare(test, regE);
}

function notFileHasContent(file, regE) {
  return !fileHasContent(file, regE);
}

module.exports = {
  fileExists,
  notFileExists,
  fileHasContent,
  notFileHasContent,
};
