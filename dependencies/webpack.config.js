const config = require("../webpack/config/dll");

config.entry = {
  dependencies: [
    // essentials
    "react",
    "react/jsx-runtime",
    "react-dom",
    "react-dom/client",
    "react-intl",
    "react-redux",
    "redux",
    "redux-saga",
    "redux-saga/effects",
    "react-router",
    "react-router-dom",
    // css-in-js
    "@linaria/react",
    "@linaria/core",
    // shims
    "regenerator-runtime/runtime.js",
  ],
};

module.exports = config;
