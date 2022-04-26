const types = require("@babel/types");

module.exports = {
  name: "register-module-inject-build-id",
  visitor: {
    CallExpression: {
      enter(path) {
        if (path.node.callee.name !== "registerModule") {
          return;
        }
        if (path.node.arguments.length === 0) {
          return;
        }
        for (const prop of path.node.arguments[0].properties) {
          if (prop.key.name === "BUILD_ID") {
            return;
          }
        }
        path.replaceWith(
          types.callExpression(types.identifier("registerModule"), [
            types.objectExpression([
              ...path.node.arguments[0].properties,
              types.objectProperty(types.identifier("BUILD_ID"), types.identifier("BUILD_ID")),
            ]),
          ]),
        );
      },
    },
  },
};