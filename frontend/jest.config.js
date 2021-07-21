module.exports = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/__tests__/utils/",
  ],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/pages/(.*)$": "<rootDir>/pages/$1",
    "^@/providers/(.*)$": "<rootDir>/providers/$1",
    "^@/public/(.*)$": "<rootDir>/public/$1",
    "^@/theme/(.*)$": "<rootDir>/theme/$1",
    "^@/abilities/(.*)$": "<rootDir>/abilities/$1",
    "^@/i18n": "<rootDir>/i18n",
    "^@/__tests__/(.*)$": "<rootDir>/__tests__/$1",

    "mapbox-gl": "maplibre-gl",
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^@fontsource(.*)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
};
