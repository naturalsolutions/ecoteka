const assetPrefix = process.env["ASSET_PREFIX"] || "";

let config = {};

// CDN Support with Asset Prefix
// https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
config.assetPrefix = assetPrefix;

config.env = {
  assetPrefix: assetPrefix,
};

module.exports = config;
