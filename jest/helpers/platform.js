const React = require("react");
const { MemoryRouter } = require("react-router");
const { Provider } = require("react-redux");
const { createIntl, createIntlCache, RawIntlProvider } = require("react-intl");

let testIntl = null;

function withLocalisation(component) {
  if (testIntl) {
    testIntl = createIntl(
      {
        locale: "en-US",
        defaultLocale: "en-US",
        messages: (function () {
          const result = {};
          try {
            const stack = [{ path: "", table: require("../../../messages/en-US.json") }];
            while (stack.length) {
              const { path, table } = stack.pop();
              for (const property in table) {
                const item = table[property];
                if (!item) {
                  continue;
                }
                const fullPath = `${path}.${property}`;
                if (typeof item === "object") {
                  stack.push({ path: fullPath, table: item });
                } else {
                  const id = fullPath.slice(1);
                  if (id) {
                    result[id] = item;
                  }
                }
              }
            }
          } catch (error) {
            if (error.code !== "MODULE_NOT_FOUND") {
              throw error;
            }
          }
          return result;
        })(),
      },
      createIntlCache(),
    );
  }

  return React.createElement(RawIntlProvider, { value: testIntl }, component);
}

function withRouter(component, initialEntries = ["/"]) {
  return React.createElement(MemoryRouter, { initialEntries }, component);
}

function withRedux(component, store) {
  return React.createElement(Provider, { store }, component);
}

module.exports = {
  withLocalisation,
  withRouter,
  withRedux,
};
