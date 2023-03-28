const plugins = ["@babel/plugin-proposal-export-default-from", "@babel/plugin-proposal-throw-expressions"];

const presets = [
  [
    "@babel/preset-typescript",
    {
      allowNamespaces: true,
    },
  ],
  [
    "@babel/preset-react",
    {
      throwIfNamespace: true,
      runtime: "automatic",
      development: false,
    },
  ],
];

const assumptions = {
  noDocumentAll: true,
  setPublicClassFields: false,
};

module.exports = {
  assumptions,
  presets,
  plugins,

  env: {
    development: {
      presets,
      plugins,
      assumptions,
    },
    production: {
      presets: [
        ...presets,
        [
          "@babel/preset-env",
          {
            useBuiltIns: false,
            targets: {
              browsers: ["last 4 versions, not dead, not op_mini all"],
            },
            debug: false,
            bugfixes: true,
            modules: false,
            shippedProposals: false,
          },
        ],
      ],
      plugins,
      assumptions,
    },
    test: {
      presets,
      plugins: [
        ...plugins,
        [
          "@babel/plugin-transform-modules-commonjs",
          {
            importInterop: "babel",
          },
        ],
      ],
      assumptions,
    },
  },
};
