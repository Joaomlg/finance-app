import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import AppContext from '../../contexts/AppContext';
import WalletItem from './WalletItem';
import { HeaderText, StyledDivider, StyledFlatList } from './styles';

const Wallets: React.FC = () => {
  const { wallets, fetchWallets, fetchingWallets } = useContext(AppContext);

  const navigation = useNavigation();

  return (
    <>
      <ScreenContainer>
        <ScreenHeader title="Carteiras" actions={[HideValuesAction()]} />
        <StyledFlatList
          refreshing={fetchingWallets}
          onRefresh={fetchWallets}
          data={wallets}
          renderItem={({ item }) => <WalletItem wallet={item} />}
          keyExtractor={(item) => item.id}
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
