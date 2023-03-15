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
  noDocumentAll: false,
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
            targets: {
              browsers: ["last 2 versions"],
            },
            modules: false,
            shippedProposals: true,
          },
        ],
      ],
      plugins,
      assumptions,
    },
    test: {
      presets,
      plugins: [...plugins, "@babel/plugin-transform-modules-commonjs"],
      assumptions,
    },
  },
};
