const { equal, notEqual } = require("./var.type");
const { shouldContain, shouldNotContain } = require("./program.type");
const {
  fileExists,
  notFileExists,
  fileHasContent,
  notFileHasContent,
} = require("./file.type");

module.exports = {
  match: equal,
  notMatch: notEqual,
  equal,
  notEqual,
  shouldContain,
  shouldNotContain,
  fileExists,
  notFileExists,
  fileHasContent,
  notFileHasContent,
};
