const React = require("react");
const { createIntl, createIntlCache, RawIntlProvider } = require("react-intl");
const { Provider } = require("react-redux");
const { MemoryRouter } = require("react-router");

const lazy = {
  get testIntl() {
    const actual = createIntl(
      {
        locale: "en-US",
        defaultLocale: "en-US",
        messages: (function () {
          const result = {};
          try {
            const stack = [{ path: "", table: require("../../../../../messages/en-US.json") }];
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

    Object.defineProperty(this, "testIntl", {
      value: actual,
      writable: false,
      configurable: false,
      enumerable: false,
    });

    return actual;
  },
};

function withLocalisation(component) {
  return React.createElement(RawIntlProvider, { value: lazy.testIntl }, component);
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
