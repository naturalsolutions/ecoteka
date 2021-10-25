const path = require("path");
const sourcePath = path.join(__dirname, "../src");

module.exports = {
  mode: "none",
  entry: path.join(sourcePath, "index.ts"),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../lib/esm"),
    libraryTarget: "commonjs",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      components: sourcePath,
    },
  },
  externals: [
    {
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
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
        },
      },
    ],
  },
};
