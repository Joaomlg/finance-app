import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Updates from 'expo-updates';

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
    checkForUpdate();

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkForUpdate();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [checkForUpdate]);
};

export default useAppUpdates;
