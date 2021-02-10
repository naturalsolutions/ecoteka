const envVars = {
  API_URL: "%api_url%",
  TOKEN_STORAGE: "%token_storage%",
  REFRESH_TOKEN_STORAGE: "%refresh_token_storage%",
  MEILI_API_URL: "%meili_api_url%",
  MEILI_MASTER_KEY: "%meili_master_key%",
};

const excludeEnvVars = ["ASSET_PREFIX"];

let config = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

config.env = {};

const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );

config.env.assetPrefix = process.env.ASSET_PREFIX || envVars.ASSET_PREFIX;
config.publicRuntimeConfig = {};

for (let env in envVars) {
  if (!excludeEnvVars.includes(env)) {
    config.publicRuntimeConfig[snakeToCamel(env)] =
      process.env[env] || envVars[env];
  }
}

config.webpack = (config, { isServer }) => {
  // Fixes npm packages that depend on `fs` module
  if (!isServer) {
    config.node = {
      fs: "empty",
    };
  }

  config.resolve.alias = {
    ...config.resolve.alias,
    "mapbox-gl": "maplibre-gl",
  };

  return config;
};

config.envVars = envVars;
module.exports = config;
