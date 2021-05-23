const { pathToFileURL } = require("url");

module.exports = {
  nexsstests: [
    {
      title: "File should have content",
      type: "fileHasContent",
      params: [
        () => {
          const filename = "xxx.txt";
          const _fs = require("fs");
          _fs.writeFileSync(filename, "works!");
          return filename;
        },
        "works!",
      ],
    },
    {
      title: "File should NOT have content",
      type: "notFileHasContent",
      params: [
        () => {
          const filename = "xxx.txt";
          const _fs = require("fs");
          _fs.writeFileSync(filename, "works!");
          return filename;
        },
        "works2!",
      ],
    },
    {
      title: "File should exists",
      type: "fileExists",
      params: [
        () => {
          const filename = "f.txt";
          const _fs = require("fs");
          _fs.writeFileSync(filename, "works!");
          return filename;
        },
      ],
    },
    {
      title: "File should NOT exist",
      type: "notFileExists",
      params: ["f1234.txt"],
    },
  ],
};
