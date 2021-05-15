const { equal, notEqual } = require("./var.type");
const { shouldContain, shouldNotContain } = require("./program.type");

module.exports = {
  match: equal,
  notMatch: notEqual,
  equal,
  notEqual,
  shouldContain,
  shouldNotContain,
};
