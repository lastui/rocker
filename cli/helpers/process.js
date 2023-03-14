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
      //console.log('BEFORE', process.env)

      await patchCwd(argv);

      const cleanupHooks = [];

      cleanupHooks.push(() => process.exit(process.exitCode || 0));

      for (const signal in ["SIGINT", "SIGTERM"]) {
        process.on(signal, () => {
          cleanupHooks.forEach((hook) => hook());
        });
      }

      process.on('beforeExit', (code) => {
        //console.log('AFTER', process.env)
        //console.log('Process beforeExit event with code: ', code);
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

