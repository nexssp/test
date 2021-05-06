module.exports = {
  nexsstests: [
    {
      title: "Should be equal '${uniqueTestValue}'",
      type: "equal",
      params: ["XXXX", "XXXX"],
    },
    {
      title: "Should not be equal: '${uniqueTestValue}'",
      type: "notEqual",
      params: ["XXXX", "NotEqal"],
    },
  ],
};
