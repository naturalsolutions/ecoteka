const envVars = {
  ASSET_PREFIX: "",
  API_URL: "%api_url%",
  TOKEN_STORAGE: "%token_storage%",
  REFRESH_TOKEN_STORAGE: "%refresh_token_storage%",
};

const excludeEnvVars = ["ASSET_PREFIX"];

let config = {
  trailingSlash: true,
};

config.env = {};

const snakeToCamel = (str) =>
  str.replace(/([-_][a-z])/g, (group) =>
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

  return config;
};

module.exports = config;
