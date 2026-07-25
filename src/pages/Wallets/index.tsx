import { useNavigation } from '@react-navigation/native';
import React, { useContext, useMemo } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import AppContext from '../../contexts/AppContext';
import { WalletGroupItem } from './types';
import WalletGroupCard from './WalletGroupCard';
import { HeaderText, StyledDivider, StyledFlatList } from './styles';

const Wallets: React.FC = () => {
  const {
    wallets,
    walletGroups,
    fetchWallets,
    fetchWalletGroups,
    fetchingWallets,
    fetchingWalletGroups,
  } = useContext(AppContext);

  const navigation = useNavigation();

  const walletGroupItems = useMemo<WalletGroupItem[]>(
    () =>
      walletGroups
        .map((group) => ({
          group,
          wallets: wallets.filter((wallet) => wallet.walletGroupId === group.id),
        }))
        .filter((item) => item.wallets.length > 0),
    [wallets, walletGroups],
  );

  const handleRefresh = () => {
    fetchWallets();
    fetchWalletGroups();
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title="Carteiras" actions={[HideValuesAction()]} />
        <StyledFlatList
          refreshing={fetchingWallets || fetchingWalletGroups}
          onRefresh={handleRefresh}
          data={walletGroupItems}
          renderItem={({ item }) => (
            <WalletGroupCard walletGroup={item.group} wallets={item.wallets} />
          )}
          keyExtractor={(item) => item.group.id}
          ItemSeparatorComponent={() => <StyledDivider />}
          ListHeaderComponent={() => (
            <HeaderText typography="light" color="textLight">
              {wallets.length} carteiras
            </HeaderText>
          )}
        />
      </ScreenContainer>
      <ScreenFloatingButton
        icon="add"
        actions={[
          {
            icon: 'link',
            text: 'Conexão automática',
            onPress: () => navigation.navigate('connect'),
            onLongPress: () => navigation.navigate('manualConnect'),
          },
          {
            icon: 'link-off',
            text: 'Carteira manual',
            onPress: () => navigation.navigate('setWallet'),
          },
        ]}
      />
    </>
  );
};

export default Wallets;
