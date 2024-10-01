import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import Avatar from '../../components/Avatar';
import Banner from '../../components/Banner';
import Divider from '../../components/Divider';
import Money from '../../components/Money';
import RowContent from '../../components/RowContent';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Svg from '../../components/Svg';
import Switch from '../../components/Switch';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { StackRouteParamList } from '../../routes/stack.routes';
import { formatDateHourFull } from '../../utils/date';
import { capitalize, ConnectionStatusMessage, walletTypeText } from '../../utils/text';
import { BottomHeader, BottomHeaderContent, InformationGroup } from './styles';

const WalletDetail: React.FC<NativeStackScreenProps<StackRouteParamList, 'wallet'>> = ({
  route,
  navigation,
}) => {
  const { wallets, fetchingWallets, fetchWallets, updateWallet, deleteWallet } =
    useContext(AppContext);

  const wallet = wallets.find(({ id }) => id === route.params.walletId);

  if (!wallet) return;

  const hasError =
    wallet.connection?.status !== 'UPDATED' && wallet.connection?.status !== 'UPDATING';

  const toggleAutoUpdate = async () => {
    if (!wallet.connection) {
      return;
    }

    await updateWallet(wallet.id, {
      connection: {
        updateDisabled: !wallet.connection.updateDisabled,
      },
    });
  };

  const handleUpdateConnection = () => {
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
      <ScreenContainer refreshing={fetchingWallets} onRefresh={fetchWallets}>
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
              <Svg height="100%" width="100%" src={wallet.styles.imageUrl} />
            </Avatar>
            <BottomHeaderContent>
              <Text typography="heading">{wallet.name}</Text>
              <Text typography="extraLight" color="textLight" selectable={true}>
                {wallet.connection?.id || wallet.id}
              </Text>
            </BottomHeaderContent>
          </BottomHeader>
          <InformationGroup>
            <RowContent text="Criado em">
              <Text typography="defaultBold">{formatDateHourFull(moment(wallet.createdAt))}</Text>
            </RowContent>
            <RowContent text="Tipo">
              <Text typography="defaultBold">{wallet.connection ? 'Automático' : 'Manual'}</Text>
            </RowContent>
            {wallet.connection && (
              <>
                <RowContent text="Atualizado em">
                  <Text typography="defaultBold">
                    {formatDateHourFull(moment(wallet.connection?.lastUpdatedAt))}
                  </Text>
                </RowContent>
                <RowContent text="Provedor">
                  <Text typography="defaultBold">
                    {capitalize(wallet.connection?.provider || '')}
                  </Text>
                </RowContent>
              </>
            )}
          </InformationGroup>
          <Divider />
          <InformationGroup>
            <RowContent text={walletTypeText[wallet.type]}>
              <Money
                typography="defaultBold"
                value={wallet.type === 'CREDIT_CARD' ? -1 * wallet.balance : wallet.balance}
              />
            </RowContent>
          </InformationGroup>
          <Divider />
          {wallet.connection && (
            <RowContent text="Pausar sincronização">
              <Switch onValueChange={toggleAutoUpdate} value={wallet.connection?.updateDisabled} />
            </RowContent>
          )}
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton
        actions={[
          {
            text: 'Atualizar',
            icon: 'sync',
            hidden: wallet.connection === undefined,
            onPress: handleUpdateConnection,
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
