const assetPrefix = process.env["ASSET_PREFIX"] || "";
const apiUrl = process.env["API_URL"] || "%api_url%";
const tokenStorage = process.env["TOKEN_STORAGE"] || "%token_storage%";
const refreshTokenStorage =
  process.env["REFRESH_TOKEN_STORAGE"] || "%refresh_token_storage%";

let config = {
  trailingSlash: true,
};

// CDN Support with Asset Prefix
// https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
config.assetPrefix = assetPrefix;

config.env = {
  assetPrefix: assetPrefix,
};

config.publicRuntimeConfig = {
  apiUrl,
  tokenStorage,
  refreshTokenStorage,
};

config.webpack = (config, { isServer }) => {
  // Fixes npm packages that depend on `fs` module
  if (!isServer) {
    config.node = {
      fs: "empty",
    };
  }

  return config;
};

module.exports = config;
