const { directoryExists } = require("./io");
const path = require("path");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const prettier = require("prettier/cli");

  const cwd = options.cwd ? path.relative(process.env.PWD, process.env.INIT_CWD).replaceAll(`.${path.sep}`, "") : "";

  const files = (await directoryExists(path.resolve(process.env.INIT_CWD, "src")))
    ? `(${path.join(cwd, "*")}\\.(js|ts|jsx|tsx)|(${path.join(cwd, "src", "**", "*")}\\.(js|ts|jsx|tsx)))`
    : `(${path.join(cwd, "**", "*")}\\.(js|ts|jsx|tsx))`;

  await prettier.run([
    ...(options.debug ? ["--loglevel=log"] : []),
    ...(options.quiet ? ["--loglevel=silent"] : []),
    ...(!(options.quiet || options.debug) ? ["--loglevel=warn"] : []),
    "--ignore-unknown",
    "--no-config",
    "--no-editorconfig",
    "--no-plugin-search",
    "--no-editorconfig",
    "--bracket-same-line",
    "--quote-props=as-needed",
    "--embedded-language-formatting=auto",
    "--end-of-line=lf",
    "--arrow-parens=always",
    "--print-width=120",
    "--trailing-comma=all",
    ...(options.fix ? ["--write"] : ["--check"]),
    files,
  ]);

  if (!options.quiet && !options.debug && !options.fix && !process.exitCode) {
    console.log("All matched files use Prettier code style!");
  }
};
