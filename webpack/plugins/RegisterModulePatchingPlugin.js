const settings = require("../settings");
const ConstDependency = require("webpack/lib/dependencies/ConstDependency");

class RegisterModulePatchingPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "RegisterModulePatchingPlugin",
      (compilation, params) => {
        params.normalModuleFactory.hooks.parser
          .for("javascript/auto")
          .tap("RegisterModulePatchingPlugin", (parser) => {
            parser.hooks.importSpecifier.tap(
              "RegisterModulePatchingPlugin",
              (statement, source, id, name) => {
                if (
                  id !== "registerModule" ||
                  !source.startsWith("@lastui/rocker/platform")
                ) {
                  return false;
                }
                parser.tagVariable(name, "registerModule", {
                  name,
                  source,
                  ids: id === null ? [] : [id],
                  sourceOrder: parser.state.lastHarmonyImportOrder,
                  await: statement.await,
                });
                return true;
              }
            );

            parser.hooks.call
              .for("registerModule")
              .tap("RegisterModulePatchingPlugin", (expression) => {
                if (expression.arguments.length === 0) {
                  return;
                }
                if (expression.arguments[0].type !== "ObjectExpression") {
                  return;
                }
                for (const arg of expression.arguments[0].properties) {
                  if (arg.value.name === "buildId") {
                    return false;
                  }
                }
                let template = "{";
                for (const arg of expression.arguments[0].properties) {
                  template += `${arg.key.name}:${arg.value.name},`;
                }
                template += `buildId:"${settings.BUILD_ID}"}`;
                expression.arguments[0].properties.push({
                  value: { name: "buildId" },
                });
                const dep = new ConstDependency(
                  `registerModule(${template})`,
                  expression.range
                );
                dep.loc = expression.loc;
                parser.state.current.addDependency(dep);
                return true;
              });
          });
      }
    );
  }
}

module.exports = RegisterModulePatchingPlugin;
