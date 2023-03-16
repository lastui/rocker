async function patchCwd(options) {
  if (options.cwd) {
    const requested = require("path").resolve(options.cwd);
    const exists = await require("./io.js").directoryExists(requested);
    if (exists) {
      process.env.INIT_CWD = requested;
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
    async handler(options) {
      await patchCwd(options);

      const cleanupHooks = [];

      cleanupHooks.push(() => process.exit(process.exitCode || 0));

      for (const signal in ["SIGINT", "SIGTERM"]) {
        process.on(signal, () => {
          cleanupHooks.forEach((hook) => hook());
        });
      }

      await command.handler(
        {
          ...options,
          _: options._.filter((item) => item !== command.command),
        },
        cleanupHooks,
      );
    },
  };
};
