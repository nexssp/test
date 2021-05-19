const params = process.argv.slice(2);
const stdout = params[0];
const stderr = params[1];
const exitCode = params[2];
if (stdout) {
  console.log(stdout);
}
if (stderr) {
  console.error(stderr);
}
if (exitCode) {
  /* eslint-disable no-process-exit */
  process.exit(exitCode);
}
