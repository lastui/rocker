const config = require("../webpack/config/dll.js");

config.entry = {
  dependencies: [
    // essentials
    "history",
    "react",
    "regenerator-runtime/runtime.js",
    "react/jsx-runtime",
    "react-dom",
    "react-dom/client",
    "react-intl",
    "react-redux",
    "redux",
    "redux-saga",
    "redux-saga/effects",
    // css-in-js
    "@linaria/react",
    "@linaria/core",
  ],
};

module.exports = config;