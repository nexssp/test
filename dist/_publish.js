(async()=>{const e=require("../package.json");e.scripts={},e.devDependencies={},e.main.startsWith("dist/")&&(e.main=e.main.slice(5)),fs.writeFileSync(__dirname+"/package.json",Buffer.from(JSON.stringify(sourceObj,null,2),"utf-8")),fs.copyFileSync(__dirname+"/../.npmignore",__dirname+"/.npmignore")})();