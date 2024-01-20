import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTheme } from 'styled-components/native';
import BelvoWidget from '../../../components/BelvoWidget';
import useBelvo from '../../../hooks/useBelvo';
import { StackRouteParamList } from '../../../routes/stack.routes';

import { Container } from './styles';

const BelvoConnect: React.FC<NativeStackScreenProps<StackRouteParamList, 'connect/belvo'>> = ({
  route,
  navigation,
}) => {
  const updateConnectionId = route.params?.updateConnectionId;

  const [widgetToken, setWidgetToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const belvoClient = useBelvo();
  const theme = useTheme();

  const handleOnSuccess = async () => {
    Toast.show({ type: 'success', text1: 'Conexão criada com sucesso!' });
    navigation.goBack();
  };

  const handleOnError = async () => {
    Toast.show({ type: 'error', text1: 'Ocorreu um erro inesperado!' });
    navigation.goBack();
  };

  const handleOnClose = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const createWidgetToken = async () => {
      try {
        const { access: token } = await belvoClient.widgetToken.create();
        setWidgetToken(token);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Não foi possível autenticar no serviço!',
          text2: 'Tente novamente em breve.',
        });
        navigation.goBack();
      }
      setIsLoading(false);
    };

    createWidgetToken();
  }, [belvoClient, updateConnectionId, navigation]);

  return (
    <Container>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <BelvoWidget
          token={widgetToken}
          options={{
            locale: 'pt',
            country_codes: ['BR'],
            external_id: undefined,
            show_close_dialog: false,
            show_abandon_survey: false,
            social_proof: false,
          }}
          onSuccess={handleOnSuccess}
          onError={handleOnError}
          onClose={handleOnClose}
        />
      )}
    </Container>
  );
};

export default BelvoConnect;
