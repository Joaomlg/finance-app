import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { SvgWithCssUri } from 'react-native-svg';
import { useTheme } from 'styled-components/native';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { StackRouteParamList } from '../../routes/stack.routes';
import { formatDateHourFull } from '../../utils/date';
import { ConnectionStatusMessage, accountName, capitalize, textCompare } from '../../utils/text';
import {
  AccountLine,
  CardErrorContainer,
  CardErrorMessage,
  CardHeaderContent,
  ConnectionAvatar,
} from '../Connections/ConnectionCard/styles';
import { Actions, BottomHeader, BottomSheet, InformationGroup, StyledHeader } from './styles';

const ConnectionDetail: React.FC<
  NativeStackScreenProps<StackRouteParamList, 'connection-detail'>
> = ({ route, navigation }) => {
  const connectionId = route.params.connectionId;

  const {
    connections,
    accounts,
    hideValues,
    setHideValues,
    deleteConnection,
    isConnectionSyncDisabled,
    toogleConnectionSyncDisabled,
  } = useContext(AppContext);

  const theme = useTheme();

  const connection = connections.find(({ id }) => id === connectionId);
  const connectionAccounts = accounts.filter((account) => account.connectionId === connectionId);

  const hasError = connection?.status !== 'UPDATED' && connection?.status !== 'UPDATING';

  const handleUpdateConnection = () => {
    if (connection === undefined) {
      return;
    }

    const provider = connection?.provider.toLowerCase();
    const uri = `connect/${provider}`;

    // @ts-expect-error Initially, the route to connect using a provider is `connect/<provider>`
    navigation.navigate(uri, { updateConnectionId: connection.id });
  };

  const handleDeleteConnection = async () => {
    if (connection === undefined) {
      return;
    }

    Alert.alert(
      'Apagar conexão?',
      'Tem certeza que deseja apagar a conexão?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Apagar',
          onPress: async () => {
            await deleteConnection(connection.id);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScreenContainer>
      <StyledHeader
        title="Detalhes da conexão"
        actions={[
          {
            icon: hideValues ? 'visibility-off' : 'visibility',
            onPress: () => setHideValues(!hideValues),
          },
        ]}
      ></StyledHeader>
      <BottomSheet>
        {connection && hasError && (
          <CardErrorContainer radius={true}>
            <MaterialIcons name="error" size={24} color={theme.colors.textWhite} />
            <CardErrorMessage>
              <Text variant="light" color="textWhite">
                Não foi possível sincronizar os dados!
              </Text>
              <Text variant="light" color="textWhite">
                {ConnectionStatusMessage[connection?.status]}
              </Text>
            </CardErrorMessage>
          </CardErrorContainer>
        )}
        <BottomHeader>
          <ConnectionAvatar color={'#' + connection?.connector.primaryColor} size={48}>
            <SvgWithCssUri height="100%" width="100%" uri={connection?.connector.imageUrl || ''} />
          </ConnectionAvatar>
          <CardHeaderContent>
            <Text variant="heading">{connection?.connector.name}</Text>
            <Text variant="extra-light" color="textLight">
              {connection?.id}
            </Text>
          </CardHeaderContent>
        </BottomHeader>
        <InformationGroup>
          <AccountLine>
            <Text>Criado em</Text>
            <Text variant="default-bold">{formatDateHourFull(moment(connection?.createdAt))}</Text>
          </AccountLine>
          <AccountLine>
            <Text>Atualizado em</Text>
            <Text variant="default-bold">
              {formatDateHourFull(moment(connection?.lastUpdatedAt))}
            </Text>
          </AccountLine>
          <AccountLine>
            <Text>Provedor</Text>
            <Text variant="default-bold">{capitalize(connection?.provider || '')}</Text>
          </AccountLine>
        </InformationGroup>
        <Divider />
        <InformationGroup>
          {connectionAccounts
            .sort((a, b) => textCompare(a.subtype, b.subtype))
            .map((account, index) => (
              <AccountLine key={index}>
                <Text>{accountName[account.subtype]}</Text>
                <Money
                  variant="default-bold"
                  value={account.subtype === 'CREDIT_CARD' ? -1 * account.balance : account.balance}
                />
              </AccountLine>
            ))}
        </InformationGroup>
        <Actions>
          <Button variant="secondary" onPress={handleUpdateConnection}>
            <Text variant="title" color="primary">
              Atualizar
            </Text>
          </Button>
          <Button variant="secondary" onPress={() => toogleConnectionSyncDisabled(connectionId)}>
            {isConnectionSyncDisabled(connectionId) ? (
              <Text variant="title" color="primary">
                Retomar sincronização
              </Text>
            ) : (
              <Text variant="title" color="error">
                Pausar sincronização
              </Text>
            )}
          </Button>
          <Button variant="secondary" onPress={handleDeleteConnection}>
            <Text variant="title" color="error">
              Apagar
            </Text>
          </Button>
        </Actions>
      </BottomSheet>
    </ScreenContainer>
  );
};

export default ConnectionDetail;
