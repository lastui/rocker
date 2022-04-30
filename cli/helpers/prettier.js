const prettier = require("prettier/cli");

exports.run = async function () {
  process.on("unhandledRejection", (reason) => {
    throw reason;
  });

  const fs = require("fs");
  const path = require("path");

  await prettier.run([
    "--loglevel=warn",
    "--ignore-unknown",
    "--no-config",
    "--no-editorconfig",
    "--bracket-same-line",
    "--quote-props=as-needed",
    "--end-of-line=lf",
    "--print-width=120",
    "--trailing-comma=all",
    "--write",
    fs.existsSync(path.resolve(process.env.INIT_CWD, "src"))
      ? "(*\\.(js|ts|jsx|tsx)|(src/**/*\\.(js|ts|jsx|tsx)))"
      : "(**/*\\.(js|ts|jsx|tsx))",
  ]);
};