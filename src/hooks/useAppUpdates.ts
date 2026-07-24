import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Updates from 'expo-updates';

// TODO: temporary workaround for the update check racing with the connections
// sync over the network at app launch/foreground, causing sync to fail.
// Remove once the sync failure has proper visibility (e.g. Crashlytics) to
// confirm the root cause and a permanent fix is in place.
const CHECK_DELAY_MS = 10000;

const useAppUpdates = () => {
  const appState = useRef(AppState.currentState);

  const checkForUpdate = useCallback(async () => {
    if (!Updates.isEnabled || __DEV__) {
      return;
    }

    try {
      const { isAvailable } = await Updates.checkForUpdateAsync();

      if (!isAvailable) {
        return;
      }

      await Updates.fetchUpdateAsync();

      Toast.show({
        type: 'info',
        text1: 'Nova atualização disponível',
        text2: 'Toque aqui para aplicar agora',
        autoHide: false,
        onPress: () => {
          Toast.hide();
          Updates.reloadAsync();
        },
      });
    } catch (error) {
      // Ignore update check/fetch failures, app keeps running on the current version.
    }
  }, []);

  useEffect(() => {
    const initialCheckTimeout = setTimeout(checkForUpdate, CHECK_DELAY_MS);

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        setTimeout(checkForUpdate, CHECK_DELAY_MS);
      }

      appState.current = nextAppState;
    });

    return () => {
      clearTimeout(initialCheckTimeout);
      subscription.remove();
    };
  }, [checkForUpdate]);
};

export default useAppUpdates;
