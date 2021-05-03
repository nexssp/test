(async () => {
  const pkg = require("../package.json");
  pkg.scripts = {};
  pkg.devDependencies = {};
  if (pkg.main.startsWith("dist/")) {
    pkg.main = pkg.main.slice(5);
  }

  fs.writeFileSync(
    __dirname + "/package.json",
    Buffer.from(JSON.stringify(sourceObj, null, 2), "utf-8")
  );

  fs.copyFileSync(__dirname + "/../.npmignore", __dirname + "/.npmignore");
})();
