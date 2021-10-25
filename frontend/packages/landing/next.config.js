const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
const { env } = require("process");

const config = {};

config.i18n = {
  locales: ["en", "fr", "es"],
  defaultLocale: "fr",
};

config.pwa = {
  dest: "public",
  runtimeCaching,
};

config.publicRuntimeConfig = {
  studioUrl: process.env.STUDIO_URL,
  isStudioReady: process.env.NEXT_PUBLIC_STUDIO_ON || false,
};

config.env = {
  STUDIO_URL: process.env.STUDIO_URL,
  NEXT_PUBLIC_STUDIO_ON: process.env.NEXT_PUBLIC_STUDIO_ON || false,
  GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS || 'G-Z0FYXJ7LPW',
  COOKIE_CONSENT: process.env.COOKIE_CONSENT || 'etk-cookie-consent'
};

module.exports = withPWA(config);
