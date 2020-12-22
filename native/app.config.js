import 'dotenv/config';

export default {
  name: 'React Native Paper Login Template',
  slug: 'react-native-paper-login-template',
  privacy: 'public',
  platforms: ['ios', 'android', 'web'],
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  extra: {
    apiV1BaseUrl:
      process.env.EXPO_ETK_API_V1_BASE_URL === 'https://dev.ecoteka.org/api/v1',
  },
};
