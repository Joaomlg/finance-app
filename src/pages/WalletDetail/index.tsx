import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import Avatar from '../../components/Avatar';
import Banner from '../../components/Banner';
import Divider from '../../components/Divider';
import Money from '../../components/Money';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Switch from '../../components/Switch';
import Text from '../../components/Text';
import AppContext2 from '../../contexts/AppContext2';
import { StackRouteParamList } from '../../routes/stack.routes';
import { formatDateHourFull } from '../../utils/date';
import { getSvgComponent } from '../../utils/svg';
import { ConnectionStatusMessage, accountName, capitalize } from '../../utils/text';
import { BottomHeader, BottomHeaderContent, InformationGroup, Line } from './styles';

const WalletDetail: React.FC<NativeStackScreenProps<StackRouteParamList, 'wallet'>> = ({
  route,
  navigation,
}) => {
  const { wallets, updateWallet, deleteWallet } = useContext(AppContext2);

  const wallet = wallets.find(({ id }) => id === route.params.walletId);

  if (!wallet) return;

  const LogoSvgComponent = getSvgComponent(wallet.styles.logoSvg);

  const hasError =
    wallet.connection?.status !== 'UPDATED' && wallet.connection?.status !== 'UPDATING';

  const toggleAutoUpdate = async () => {
    if (!wallet.connection) {
      return;
    }

    updateWallet(wallet.id, {
      connection: {
        updateDisabled: !wallet.connection.updateDisabled,
      },
    });
  };

  const handleUpdateConnection = () => {
    if (wallet.connection === undefined) {
      return;
    }

    const provider = wallet.connection?.provider.toLowerCase();
    const uri = `connect/${provider}`;

    // @ts-expect-error Initially, the route to connect using a provider is `connect/<provider>`
    navigation.navigate(uri, { updateConnectionId: wallet.connection.id });
  };

  const handleEditWallet = () => {
    navigation.navigate('setWallet', { walletId: wallet.id });
  };

  const handleDeleteWallet = async () => {
    Alert.alert(
      'Apagar carteira?',
      'Tem certeza que deseja apagar a carteira?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Apagar',
          onPress: async () => {
            await deleteWallet(wallet);
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
        <ScreenHeader title="Detalhes da carteira" actions={[HideValuesAction()]} />
        <ScreenContent>
          {wallet.connection && hasError && (
            <Banner
              icon="error"
              message="Não foi possível sincronizar os dados!"
              message2={ConnectionStatusMessage[wallet.connection?.status]}
              rounded={true}
            />
          )}
          <BottomHeader>
            <Avatar color={wallet.styles.primaryColor} size={48}>
              <LogoSvgComponent height="100%" width="100%" />
            </Avatar>
            <BottomHeaderContent>
              <Text typography="heading">{wallet.name}</Text>
              <Text typography="extraLight" color="textLight" selectable={true}>
                {wallet.connection?.id || wallet.id}
              </Text>
            </BottomHeaderContent>
          </BottomHeader>
          <InformationGroup>
            <Line>
              <Text>Criado em</Text>
              <Text typography="defaultBold">{formatDateHourFull(moment(wallet.createdAt))}</Text>
            </Line>
            <Line>
              <Text>Tipo</Text>
              <Text typography="defaultBold">{wallet.connection ? 'Automático' : 'Manual'}</Text>
            </Line>
            {wallet.connection && (
              <>
                <Line>
                  <Text>Atualizado em</Text>
                  <Text typography="defaultBold">
                    {formatDateHourFull(moment(wallet.connection?.lastUpdatedAt))}
                  </Text>
                </Line>
                <Line>
                  <Text>Provedor</Text>
                  <Text typography="defaultBold">
                    {capitalize(wallet.connection?.provider || '')}
                  </Text>
                </Line>
              </>
            )}
          </InformationGroup>
          <Divider />
          <InformationGroup>
            <Line>
              <Text>{accountName[wallet.type]}</Text>
              <Money
                typography="defaultBold"
                value={wallet.type === 'CREDIT_CARD' ? -1 * wallet.balance : wallet.balance}
              />
            </Line>
          </InformationGroup>
          <Divider />
          {wallet.connection && (
            <Line>
              <Text>Pausar sincronização</Text>
              <Switch onValueChange={toggleAutoUpdate} value={wallet.connection?.updateDisabled} />
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
            disabled: wallet.connection === undefined,
          },
          { text: 'Editar', icon: 'edit', onPress: handleEditWallet },
          { text: 'Remover', icon: 'delete', onPress: handleDeleteWallet },
        ]}
        icon="more-horiz"
      />
    </>
  );
};

export default WalletDetail;
