import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useContext, useRef } from 'react';
import { Alert, ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgWithCssUri } from 'react-native-svg';
import { useTheme } from 'styled-components/native';
import Card from '../../../components/Card';
import Divider from '../../../components/Divider';
import FlexContainer from '../../../components/FlexContainer';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import AppContext from '../../../contexts/AppContext';
import { Account, AccountSubType, Connection, ConnectionStatus } from '../../../models';
import { LastUpdateDateFormat } from '../../../utils/contants';
import ConnectionMenu, { Option } from '../ConnectionMenu';

import { textCompare } from '../../../utils/text';
import {
  AccountLine,
  CardContent,
  CardErrorContainer,
  CardErrorMessage,
  CardHeader,
  CardHeaderContent,
  ConnectionAvatar,
} from './styles';

const accountName: Record<AccountSubType, string> = {
  CHECKING_ACCOUNT: 'Conta corrente',
  SAVINGS_ACCOUNT: 'Conta poupança',
  CREDIT_CARD: 'Cartão de crédito',
};

const ConnectionStatusMessage: Record<ConnectionStatus, string> = {
  UPDATED: '',
  UPDATING: '',
  LOGIN_ERROR: 'Atualize as credenciais da conexão.',
  WAITING_USER_INPUT: 'Autenticação de duas etapas solicitada.',
  OUTDATED: 'Sincronize a conexão novamente.',
};

export interface ConnectionCardProps extends ViewProps {
  connection: Connection;
  accounts: Account[];
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, accounts, ...viewProps }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { deleteConnection } = useContext(AppContext);

  const theme = useTheme();
  const navigation = useNavigation();

  const lastUpdateDate = connection.lastUpdatedAt
    ? moment(connection.lastUpdatedAt).format(LastUpdateDateFormat)
    : 'nunca';

  const hasError = connection.status !== 'UPDATED' && connection.status !== 'UPDATING';

  const handleCardOptionPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleUpdateConnection = () => {
    const provider = connection.provider.toLowerCase();
    const uri = `connect/${provider}`;
    // @ts-expect-error Initially, the route to connect using a provider is `connect/<provider>`
    navigation.navigate(uri, { updateConnectionId: connection.id });
  };

  const handleDeleteConnection = async () => {
    Alert.alert(
      'Apagar conexão?',
      'Tem certeza que deseja apagar a conexão?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Apagar',
          onPress: async () => {
            await deleteConnection(connection.id);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleMenuOptionPress = (option: Option) => {
    bottomSheetModalRef.current?.dismiss();

    if (option === 'update') {
      return handleUpdateConnection();
    }

    if (option === 'delete') {
      return handleDeleteConnection();
    }
  };

  return (
    <>
      <Card {...viewProps}>
        {hasError && (
          <CardErrorContainer>
            <MaterialIcons name="error" size={24} color={theme.colors.textWhite} />
            <CardErrorMessage>
              <Text variant="light" color="textWhite">
                Não foi possível sincronizar os dados!
              </Text>
              <Text variant="light" color="textWhite">
                {ConnectionStatusMessage[connection.status]}
              </Text>
            </CardErrorMessage>
          </CardErrorContainer>
        )}
        <CardContent>
          <CardHeader>
            <ConnectionAvatar color={'#' + connection.connector.primaryColor}>
              <SvgWithCssUri height="100%" width="100%" uri={connection.connector.imageUrl} />
            </ConnectionAvatar>
            <CardHeaderContent>
              <Text>{connection.connector.name}</Text>
              <Text variant="extra-light" color="textLight">
                Sincronizado em: {lastUpdateDate}
              </Text>
            </CardHeaderContent>
            <TouchableOpacity>
              <MaterialIcons
                name="more-vert"
                size={24}
                color={theme.colors.primary}
                onPress={handleCardOptionPress}
              />
            </TouchableOpacity>
          </CardHeader>
          <Divider />
          <FlexContainer gap={16}>
            {accounts
              .sort((a, b) => textCompare(a.subtype, b.subtype))
              .map((account, index) => (
                <AccountLine key={index}>
                  <Text>{accountName[account.subtype]}</Text>
                  <Money
                    variant="default-bold"
                    value={
                      account.subtype === 'CREDIT_CARD' ? -1 * account.balance : account.balance
                    }
                  />
                </AccountLine>
              ))}
          </FlexContainer>
        </CardContent>
      </Card>
      <ConnectionMenu onPress={handleMenuOptionPress} ref={bottomSheetModalRef} />
    </>
  );
};

export default ConnectionCard;
