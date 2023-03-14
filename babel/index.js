const plugins = [
  "@babel/plugin-proposal-export-default-from",
  "@babel/plugin-transform-react-display-name",
  "@babel/plugin-proposal-logical-assignment-operators",
  [
    "@babel/plugin-proposal-optional-chaining",
    {
      loose: false,
    },
  ],
  [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    {
      loose: false,
    },
  ],
  "@babel/plugin-proposal-export-namespace-from",
  "@babel/plugin-proposal-numeric-separator",
  "@babel/plugin-proposal-throw-expressions",
  [
    "@babel/plugin-proposal-class-properties",
    {
      loose: false,
    },
  ],
];

const presets = [
  "@babel/preset-typescript",
  [
    "@babel/preset-react",
    {
      throwIfNamespace: true,
      runtime: "automatic",
      development: false,
    },
  ],
];

module.exports = {
  presets,

  plugins,

  env: {
    development: {
      presets,
      plugins,
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
      plugins: [...plugins, "@babel/plugin-proposal-json-strings"],
    },
    test: {
      presets,
      plugins: [...plugins, "@babel/plugin-transform-modules-commonjs"],
    },
  },
};
