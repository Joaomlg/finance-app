import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import WalletCard from './WalletCard';

const Wallets: React.FC = () => {
  const { wallets, fetchWallets, fetchingWallets } = useContext(AppContext);

  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <>
      <ScreenContainer>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={fetchingWallets}
              onRefresh={fetchWallets}
              colors={[theme.colors.primary]}
            />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          stickyHeaderIndices={[0]}
        >
          <ScreenHeader title="Carteiras" actions={[HideValuesAction()]} />
          <ScreenContent>
            <Text typography="light" color="textLight">
              {wallets.length} carteiras
            </Text>
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </ScreenContent>
        </ScrollView>
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
