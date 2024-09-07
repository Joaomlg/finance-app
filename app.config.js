const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'Finans (Dev)' : 'Finans',
    slug: 'finance-app',
    version: '2.0.2',
    orientation: 'portrait',
    icon: IS_DEV ? './src/assets/dev-icon.png' : './src/assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#284D63',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/752d9743-e7cd-4faf-b1a0-e6f9a43a91d9',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      googleServicesFile: './GoogleService-Info.plist',
      supportsTablet: true,
      bundleIdentifier: IS_DEV ? 'com.joaomlg.financeapp.dev' : 'com.joaomlg.financeapp',
    },
    android: {
      googleServicesFile: './google-services.json',
      adaptiveIcon: {
        foregroundImage: IS_DEV
          ? './src/assets/dev-adaptive-icon.png'
          : './src/assets/adaptive-icon.png',
        backgroundColor: '#E5E7EB',
      },
      package: IS_DEV ? 'com.joaomlg.financeapp.dev' : 'com.joaomlg.financeapp',
    },
    web: {
      favicon: './src/assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '752d9743-e7cd-4faf-b1a0-e6f9a43a91d9',
      },
    },
    runtimeVersion: 'exposdk:51.0.0',
    plugins: [
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      '@react-native-google-signin/google-signin',
      'expo-font',
    ],
  },
};
