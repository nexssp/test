const { yellow, blue, green, red } = require("@nexssp/ansi");

const path = require("path");

function camelCase(text) {
  var result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

if (process.versions.node.split(".")[0] * 1 < 12) {
  // ???????
  const { nSpawnSync } = require("../../lib/nProcess");

  exe = nSpawnSync; // Because of the NODEJS 10.
} else {
  exe = exeOLD;
}

function exeOLD(command, options) {
  options = options || {};
  if (process.platform !== "win32") {
    Object.assign(options, { shell: process.shell });
  }
  if (!options.cwd) {
    delete options.cwd;
  }
  // options.maxBuffer = 52428800; // 10*default
  let r;

  const { execSync } = require("child_process");
  try {
    r = execSync(`${command} --nxsPipeErrors`, options).toString();
    return r;
  } catch (er) {
    r = er.stdout.toString();
    // err.stderr;
    // err.pid;
    // err.signal;
    // err.status;
    if (process.argv.includes("--errors")) {
      console.error(er);
    }
    if (options && options.stopOnErrors) process.exitCode = 1;
  }
  return r;
}

var fs = require("fs");

// https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function logToFile(data) {
  const LogFile = logPath + path.join("TEST.log");
  return require("fs").appendFileSync(
    LogFile,
    new Date().toISOString() + " " + JSON.stringify(data, null, 2) + "\n"
  );
}

const logPath = "./logs";

const defaultOptions = {};
if (process.platform !== "win32") {
  Object.assign(defaultOptions, { shell: process.shell });
}

const getResults = (stderr, stdout) => {
  const outputString = stdout && stdout.toString();
  const errorString = stderr && stderr.toString();
  const separator = outputString && errorString ? "\n" : "";

  return outputString + (errorString ? separator + errorString : "");
};

const nSpawnSync = (command, options) => {
  opts = Object.assign({}, defaultOptions, options) || defaultOptions;
  const { spawnSync } = require("child_process");

  try {
    const result = spawnSync(`${command} --nxsPipeErrors`, options);
    return getResults(result.stderr, result.stdout);
  } catch (er) {
    return getResults(er.stderr, er.stdout);
  }
};

module.exports = {
  nSpawnSync,
  yellow,
  blue,
  green,
  red,
  // bright,
  camelCase,
  exe,
  deleteFolderRecursive,
  logToFile,
  logPath,
};
