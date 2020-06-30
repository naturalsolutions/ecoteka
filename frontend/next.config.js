const withCss = require("@zeit/next-css");
const withLess = require("@zeit/next-less");

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => { };
}

let config = withCss(
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true
    }
  })
);

const assetPrefix = process.env["ASSET_PREFIX"] || "";

// CDN Support with Asset Prefix
// https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
config.assetPrefix = assetPrefix;

config.env = {
  assetPrefix: assetPrefix,
};

module.exports = config;
