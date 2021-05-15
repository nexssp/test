module.exports = {
  nexsstests: [
    // UniqueTestValues is specified in the test definition.
    {
      type: "shouldContain",
      params: [
        `node ${__dirname.replace(/\\/g, "/")}/test_stdio.js 'xxx' 'yyyy' 12`,
        /xxx/,
        {
          exitCode: 12,
        },
      ],
    },
    {
      type: "shouldContain",
      testFunction: "nSpawn",
      params: [
        `node ${__dirname.replace(/\\/g, "/")}/test_stdio.js 'xxx' 'yyyy' 0`,
        /yyyy/,
      ],
    },
    {
      type: "shouldContain",
      testFunction: "nSpawn",
      params: [
        `node ${__dirname.replace(/\\/g, "/")}/test_stdio.js '' 'yyyy' 1`,
        /yyyy/,
        {
          exitCode: 1,
        },
      ],
    },
    {
      type: "shouldContain",
      testFunction: "nSpawn",
      params: [
        `node ${__dirname.replace(/\\/g, "/")}/test_stdio.js '' 'yyyy' 13`,
        /yyyy/,
        {
          exitCode: 13,
        },
      ],
    },
  ],
};
