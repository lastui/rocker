exports.envelope = function (command) {
  return {
    command: command.command,
    describe: command.describe,
    builder: command.builder,
    async handler(argv) {
      const cleanupHooks = [];

      if (argv.cwd) {
        process.env.INIT_CWD = require("path").resolve(argv.cwd);
      } else {
        process.env.INIT_CWD = process.cwd();
      }

      cleanupHooks.push(() => process.exit(process.exitCode || 0));

      const signals = ["SIGINT", "SIGTERM"];
      signals.forEach(function (sig) {
        process.on(sig, () => {
          cleanupHooks.forEach((hook) => hook());
        });
      });

      await command.handler(argv, cleanupHooks);
    },
  };
};