const t = require("@babel/types");

module.exports = {
	name: "register-module-inject-build-id",
	visitor: {
		CallExpression: {
			enter(path) {
				if (path.node.callee.name !== "registerModule") {
					return;
				}
				if (path.node.arguments.length == 0) {
					return;
				}
				for (const prop of path.node.arguments[0].properties) {
					if (prop.key.name === "BUILD_ID") {
						return;
					}
				}

				path.replaceWith(t.callExpression(
					t.identifier("registerModule"),
					[
						t.objectExpression([
							...path.node.arguments[0].properties,
							t.objectProperty(
								t.identifier("BUILD_ID"),
								t.identifier("BUILD_ID")
							),
						]),
					]
				));
			},
		},
	},
};
