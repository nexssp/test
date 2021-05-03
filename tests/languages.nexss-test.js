module.exports = {
  uniqueTestValues: [".js", ".py"],
  testsSelect: [1, 2],
  startFrom: null, // eg. .cs
  endsWith: null, // eg .cs
  nexsstests: [
    // UniqueTestValues is specified in the test definition.
    {
      title: "Creating file for ${uniqueTestValue}",
      type: "shouldContain",
      params: [
        "nexss file add Default${uniqueTestValue} --t=default --f",
        /OK  File (.*) has been created/,
      ],
    },
    {
      title: "Test without Unicode",
      type: "shouldContain",
      params: ["nexss Default${uniqueTestValue}", /"test":(.*)"test"/],
    },
    {
      title: "Test Unicode characters",
      type: "shouldContain",
      params: [
        "nexss Default${uniqueTestValue} --nxsTest",
        /"test":(.*)"test"/,
      ],
    },
  ],
};
