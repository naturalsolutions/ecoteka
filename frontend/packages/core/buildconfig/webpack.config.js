module.exports = (distRoot, optimize) => ({
  mode: "production",
  optimization: {
    minimize: !!optimize,
  },
  entry: "./src/index.ts",
  output: {
    path: distRoot,
    filename: optimize ? "ecoteka-core.min.js" : "ecoteka-core.js",
    library: "ecoTeka Core",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            envName: `dist-${optimize ? "prod" : "dev"}`,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
    "@material-ui/core": {
      root: "MaterialUI",
      commonjs: "@material-ui/core",
      commonjs2: "@material-ui/core",
      amd: "@material-ui/core",
    },
  },
});
