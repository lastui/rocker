const fs = require("fs");
const path = require("path");
const prettier = require("prettier/cli");

exports.run = async function (options) {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const cwd = options.cwd ? `${options.cwd.replaceAll(`.${path.delimiter}`, "")}${path.delimiter}` : "";

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
    ...(options.fix ? ["--write"] : []),
    fs.existsSync(path.resolve(process.env.INIT_CWD, "src"))
      ? `(${cwd}*\\.(js|ts|jsx|tsx)|(${cwd}${path.join("src", "**", "*")}\\.(js|ts|jsx|tsx)))`
      : `(${cwd}${path.join("**", "*")}\\.(js|ts|jsx|tsx))`,
  ];

  await prettier.run(prettierOptions);
};