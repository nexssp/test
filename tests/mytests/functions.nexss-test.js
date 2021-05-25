module.exports = {
  nexsstests: [
    {
      type: "equal",
      params: [
        () => {
          const os = require("@nexssp/os/legacy");
          return os.name();
        },
        process.platform == "win32"
          ? /(?:Windows)/
          : /(?:Ubuntu|Alpine|somethingelse)/,
      ],
    },
  ],
};
