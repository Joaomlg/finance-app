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
  const {
    wallets,
    walletGroups,
    fetchingWallets,
    fetchWallets,
    updateWalletGroup,
    deleteWalletGroup,
  } = useContext(AppContext);

  const walletGroup = walletGroups.find(({ id }) => id === route.params.walletGroupId);
  const groupWallets = wallets.filter(
    (wallet) => wallet.walletGroupId === route.params.walletGroupId,
  );

  if (!walletGroup) return;

  const isAutomatic = walletGroup.type === 'AUTOMATIC';
  const hasError =
    isAutomatic && walletGroup.status !== 'UPDATED' && walletGroup.status !== 'UPDATING';

  const toggleAutoUpdate = async () => {
    if (walletGroup.type !== 'AUTOMATIC') {
      return;
    }

    await updateWalletGroup(walletGroup.id, {
      updateDisabled: !walletGroup.updateDisabled,
    });
  };

  const handleUpdateConnection = () => {
    if (walletGroup.type !== 'AUTOMATIC') {
      return;
    }

    const provider = walletGroup.provider.toLowerCase();
    const uri = `connect/${provider}`;

    // @ts-expect-error Initially, the route to connect using a provider is `connect/<provider>`
    navigation.navigate(uri, { updateConnectionId: walletGroup.id });
  };

  const handleEditWallet = () => {
    navigation.navigate('setWallet', { walletGroupId: walletGroup.id });
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
            await deleteWalletGroup(walletGroup);
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
          {isAutomatic && hasError && (
            <Banner
              icon="error"
              message="Não foi possível sincronizar os dados!"
              message2={ConnectionStatusMessage[walletGroup.status]}
              rounded={true}
            />
          )}
          <BottomHeader>
            <Avatar color={walletGroup.styles.primaryColor} size={48}>
              <Svg height="100%" width="100%" src={walletGroup.styles.imageUrl} />
            </Avatar>
            <BottomHeaderContent>
              <Text typography="heading">{walletGroup.name}</Text>
              <Text typography="extraLight" color="textLight" selectable={true}>
                {walletGroup.id}
              </Text>
            </BottomHeaderContent>
          </BottomHeader>
          <InformationGroup>
            <RowContent text="Criado em">
              <Text typography="defaultBold">
                {formatDateHourFull(moment(walletGroup.createdAt))}
              </Text>
            </RowContent>
            <RowContent text="Tipo">
              <Text typography="defaultBold">{isAutomatic ? 'Automático' : 'Manual'}</Text>
            </RowContent>
            {isAutomatic && (
              <>
                <RowContent text="Atualizado em">
                  <Text typography="defaultBold">
                    {formatDateHourFull(moment(walletGroup.lastUpdatedAt))}
                  </Text>
                </RowContent>
                <RowContent text="Provedor">
                  <Text typography="defaultBold">{capitalize(walletGroup.provider)}</Text>
                </RowContent>
              </>
            )}
          </InformationGroup>
          <Divider />
          <InformationGroup>
            {isAutomatic && !!walletGroup.investmentAmount && (
              <RowContent text="Investimentos">
                <Money typography="defaultBold" value={walletGroup.investmentAmount} />
              </RowContent>
            )}
            {groupWallets.map((wallet) => (
              <RowContent key={wallet.id} text={walletTypeText[wallet.type]}>
                <Money
                  typography="defaultBold"
                  value={wallet.type === 'CREDIT_CARD' ? -1 * wallet.balance : wallet.balance}
                />
              </RowContent>
            ))}
          </InformationGroup>
          <Divider />
          {isAutomatic && (
            <RowContent text="Pausar sincronização">
              <Switch onValueChange={toggleAutoUpdate} value={walletGroup.updateDisabled} />
            </RowContent>
          )}
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton
        actions={[
          {
            text: 'Atualizar',
            icon: 'sync',
            hidden: !isAutomatic,
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
