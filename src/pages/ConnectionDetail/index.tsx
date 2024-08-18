import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { SvgWithCssUri } from 'react-native-svg/css';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import Icon from '../../components/Icon';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
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
} from '../Connections/ConnectionCard/styles';
import { Actions, BottomHeader, InformationGroup } from './styles';

const ConnectionDetail: React.FC<
  NativeStackScreenProps<StackRouteParamList, 'connection-detail'>
> = ({ route, navigation }) => {
  const connectionId = route.params.connectionId;

  const {
    connections,
    accounts,
    deleteConnection,
    isConnectionSyncDisabled,
    toogleConnectionSyncDisabled,
  } = useContext(AppContext);

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
      <ScreenHeader title="Detalhes da conexão" actions={[HideValuesAction()]} />
      <ScreenContent>
        {connection && hasError && (
          <CardErrorContainer radius={true}>
            <Icon name="error" size={24} color="textWhite" />
            <CardErrorMessage>
              <Text typography="light" color="textWhite">
                Não foi possível sincronizar os dados!
              </Text>
              <Text typography="light" color="textWhite">
                {ConnectionStatusMessage[connection?.status]}
              </Text>
            </CardErrorMessage>
          </CardErrorContainer>
        )}
        <BottomHeader>
          <Avatar color={'#' + connection?.connector.primaryColor} size={48}>
            <SvgWithCssUri height="100%" width="100%" uri={connection?.connector.imageUrl || ''} />
          </Avatar>
          <CardHeaderContent>
            <Text typography="heading">{connection?.connector.name}</Text>
            <Text typography="extraLight" color="textLight">
              {connection?.id}
            </Text>
          </CardHeaderContent>
        </BottomHeader>
        <InformationGroup>
          <AccountLine>
            <Text>Criado em</Text>
            <Text typography="defaultBold">
              {formatDateHourFull(moment(connection?.createdAt))}
            </Text>
          </AccountLine>
          <AccountLine>
            <Text>Atualizado em</Text>
            <Text typography="defaultBold">
              {formatDateHourFull(moment(connection?.lastUpdatedAt))}
            </Text>
          </AccountLine>
          <AccountLine>
            <Text>Provedor</Text>
            <Text typography="defaultBold">{capitalize(connection?.provider || '')}</Text>
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
                  typography="defaultBold"
                  value={account.subtype === 'CREDIT_CARD' ? -1 * account.balance : account.balance}
                />
              </AccountLine>
            ))}
        </InformationGroup>
        <Actions>
          <Button variant="secondary" onPress={handleUpdateConnection}>
            <Text typography="title">Atualizar</Text>
          </Button>
          <Button variant="secondary" onPress={() => toogleConnectionSyncDisabled(connectionId)}>
            {isConnectionSyncDisabled(connectionId) ? (
              <Text typography="title">Retomar sincronização</Text>
            ) : (
              <Text typography="title" color="error">
                Pausar sincronização
              </Text>
            )}
          </Button>
          <Button variant="secondary" onPress={handleDeleteConnection}>
            <Text typography="title" color="error">
              Apagar
            </Text>
          </Button>
        </Actions>
      </ScreenContent>
    </ScreenContainer>
  );
};

export default ConnectionDetail;
