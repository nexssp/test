module.exports = {
  nexsstests: [
    {
      testFunction: "nExec",
      title: "Program run: dir",
      type: "shouldContain",
      params:
        process.platform === "win32"
          ? ["dir", / Directory of/]
          : ["mkdir abc-folder && ls", /abc-folder/],
    },
  ],
};
