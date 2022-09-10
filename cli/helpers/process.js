async function patchCwd(argv) {
  if (argv.cwd) {
    const requested = require("path").resolve(argv.cwd);
    const exists = await require("./io.js").directoryExists(requested);
    if (exists) {
      process.env.INIT_CWD = requested;
      return;
    }
  }
  if (!process.env.INIT_CWD) {
    process.env.INIT_CWD = process.cwd();
  }
}

exports.envelope = function (command) {
  return {
    command: command.command,
    describe: command.describe,
    builder: command.builder,
    async handler(argv) {
      await patchCwd(argv);

      const cleanupHooks = [];

      cleanupHooks.push(() => process.exit(process.exitCode || 0));

      const signals = ["SIGINT", "SIGTERM"];
      signals.forEach(function (sig) {
        process.on(sig, () => {
          cleanupHooks.forEach((hook) => hook());
        });
      });

      await command.handler(
        {
          ...argv,
          _: argv._.filter((item) => item !== command.command),
        },
        cleanupHooks,
      );
    },
  };
};