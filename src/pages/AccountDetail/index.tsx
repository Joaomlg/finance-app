import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext } from 'react';
import { Alert, Switch } from 'react-native';
import { useTheme } from 'styled-components';
import Avatar from '../../components/Avatar';
import Banner from '../../components/Banner';
import Divider from '../../components/Divider';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Text from '../../components/Text';
import AppContext2 from '../../contexts/AppContext2';
import { NewAccount } from '../../models';
import { StackRouteParamList } from '../../routes/stack.routes';
import { formatDateHourFull } from '../../utils/date';
import { cloneObject } from '../../utils/object';
import { getSvgComponent } from '../../utils/svg';
import { ConnectionStatusMessage, accountName, capitalize, textCompare } from '../../utils/text';
import { BottomHeader, BottomHeaderContent, InformationGroup, Line } from './styles';

const AccountDetail: React.FC<NativeStackScreenProps<StackRouteParamList, 'accountDetail'>> = ({
  route,
  navigation,
}) => {
  const { accounts, setAccount, deleteAccount } = useContext(AppContext2);

  const theme = useTheme();

  const account = accounts.find(({ id }) => id === route.params.accountId);

  if (!account) return;

  const LogoSvgComponent = getSvgComponent(account.logoSvg);

  const hasError =
    account.connection?.status !== 'UPDATED' && account.connection?.status !== 'UPDATING';

  const toggleAutoUpdate = async () => {
    if (!account.connection) {
      return;
    }

    const clonedAccount = cloneObject(account) as NewAccount;

    //@ts-expect-error connection is defined
    clonedAccount.connection.updateDisabled = !clonedAccount.connection.updateDisabled;

    setAccount(clonedAccount);
  };

  const handleUpdateConnection = () => {
    if (account.connection === undefined) {
      return;
    }

    const provider = account.connection?.provider.toLowerCase();
    const uri = `connect/${provider}`;

    // @ts-expect-error Initially, the route to connect using a provider is `connect/<provider>`
    navigation.navigate(uri, { updateConnectionId: account.connection.id });
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Apagar conta?',
      'Tem certeza que deseja apagar a conta?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Apagar',
          onPress: async () => {
            await deleteAccount(account);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title="Detalhes da conta" actions={[HideValuesAction()]} />
        <ScreenContent>
          {account.connection && hasError && (
            <Banner
              icon="error"
              message="Não foi possível sincronizar os dados!"
              message2={ConnectionStatusMessage[account.connection?.status]}
              rounded={true}
            />
          )}
          <BottomHeader>
            <Avatar color={account.primaryColor} size={48}>
              <LogoSvgComponent height="100%" width="100%" />
            </Avatar>
            <BottomHeaderContent>
              <Text typography="heading">{account.name}</Text>
              <Text typography="extraLight" color="textLight" selectable={true}>
                {account.connection?.id || account.id}
              </Text>
            </BottomHeaderContent>
          </BottomHeader>
          <InformationGroup>
            <Line>
              <Text>Criado em</Text>
              <Text typography="defaultBold">{formatDateHourFull(moment(account.createdAt))}</Text>
            </Line>
            <Line>
              <Text>Tipo</Text>
              <Text typography="defaultBold">{account.connection ? 'Automático' : 'Manual'}</Text>
            </Line>
            {account.connection && (
              <>
                <Line>
                  <Text>Atualizado em</Text>
                  <Text typography="defaultBold">
                    {formatDateHourFull(moment(account.connection?.lastUpdatedAt))}
                  </Text>
                </Line>
                <Line>
                  <Text>Provedor</Text>
                  <Text typography="defaultBold">
                    {capitalize(account.connection?.provider || '')}
                  </Text>
                </Line>
              </>
            )}
          </InformationGroup>
          <Divider />
          <InformationGroup>
            {account.wallets
              .sort((a, b) => textCompare(a.subtype, b.subtype))
              .map((account, index) => (
                <Line key={index}>
                  <Text>{accountName[account.subtype]}</Text>
                  <Money
                    typography="defaultBold"
                    value={
                      account.subtype === 'CREDIT_CARD' ? -1 * account.balance : account.balance
                    }
                  />
                </Line>
              ))}
          </InformationGroup>
          <Divider />
          {account.connection && (
            <Line>
              <Text>Pausar sincronização</Text>
              <Switch
                onValueChange={toggleAutoUpdate}
                value={account.connection?.updateDisabled}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.primary }}
                thumbColor={
                  account.connection?.updateDisabled ? theme.colors.white : theme.colors.lightGray
                }
              />
            </Line>
          )}
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton
        actions={[
          {
            text: 'Atualizar',
            icon: 'sync',
            onPress: handleUpdateConnection,
            disabled: account.connection === undefined,
          },
          { text: 'Remover', icon: 'delete', onPress: handleDeleteAccount },
        ]}
        icon="more-horiz"
      />
    </>
  );
};

export default AccountDetail;
