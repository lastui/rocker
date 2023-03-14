const fs = require("fs");
const path = require("path");
const prettier = require("prettier/cli");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const cwd = options.cwd ? path.relative(process.env.PWD, process.env.INIT_CWD).replaceAll(`.${path.sep}`, "") : "";

  const prettierOptions = [
    ...(options.debug ? ["--loglevel=log"] : ["--loglevel=warn"]),
    "--ignore-unknown",
    "--no-config",
    "--no-editorconfig",
    "--bracket-same-line",
    "--quote-props=as-needed",
    "--end-of-line=lf",
    "--print-width=120",
    "--trailing-comma=all",
    ...(options.fix ? ["--write"] : ["--check"]),
    fs.existsSync(path.resolve(cwd, "src"))
      ? `(${path.join(cwd, "*")}\\.(js|ts|jsx|tsx)|(${path.join(cwd, "src", "**", "*")}\\.(js|ts|jsx|tsx)))`
      : `(${path.join(cwd, "**", "*")}\\.(js|ts|jsx|tsx))`,
  ];

  await prettier.run(prettierOptions);
};
