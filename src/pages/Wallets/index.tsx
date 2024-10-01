import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
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

  const navigation = useNavigation();

  return (
    <>
      <ScreenContainer refreshing={fetchingWallets} onRefresh={fetchWallets} stickHeader={true}>
        <ScreenHeader title="Carteiras" actions={[HideValuesAction()]} />
        <ScreenContent>
          <Text typography="light" color="textLight">
            {wallets.length} carteiras
          </Text>
          {wallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </ScreenContent>
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
