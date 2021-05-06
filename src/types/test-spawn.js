const { exe } = require("../lib");

const command = `nexss Output/End 'works on Ubuntu' --platform:check='UBUNTU' --platform:noerror`;
// const command = `nexss Nexss/Test/Errors --file=1.png --text="yes"`;
(async () => {
  console.log(await exe(command));
})();
