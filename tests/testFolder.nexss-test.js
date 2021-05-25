const { getNewTestFolder } = require("../lib/test");
module.exports = {
  nexsstests: [
    // UniqueTestValues is specified in the test definition.
    {
      title: "Temp folder should exists",
      type: "equal",
      params: [
        () => {
          const tf = getNewTestFolder();
          return tf;
        },
        /Nexss-test-/,
      ],
    },
  ],
};
