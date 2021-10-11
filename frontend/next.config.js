const envVars = {
  API_URL: "%api_url%",
  TOKEN_STORAGE: "%token_storage%",
  REFRESH_TOKEN_STORAGE: "%refresh_token_storage%",
  MEILI_API_URL: "%meili_api_url%",
  MEILI_MASTER_KEY: "%meili_master_key%",
  MAPILLARY_API_CLIENT: "%mapillary_api_client%",
  GOOGLE_ANALYTICS: "%google_analytics%",
};

const excludeEnvVars = ["ASSET_PREFIX"];

let config = {
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

  config.module.rules.push({
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  });

  config.resolve.alias = {
    ...config.resolve.alias,
    "mapbox-gl": "maplibre-gl",
  };

  return config;
};

config.webpackDevMiddleware = (config) => {
  config.watchOptions = {
    poll: 1000,
    aggregateTimeout: 300,
  };

  return config;
};

config.envVars = envVars;

config.i18n = {
  locales: ["en", "fr", "es"],
  defaultLocale: "fr",
};

config.webpack5 = false;

module.exports = config;
