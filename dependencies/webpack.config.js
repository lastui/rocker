const config = require("../webpack/config/dll");

config.entry = {
  dependencies: [
    // essentials
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
    "react-router",
    "react-router-dom",
    // css-in-js
    "@linaria/react",
    "@linaria/core",
  ],
};

module.exports = config;