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
import AppContext2 from '../../contexts/AppContext2';
import AccountCard from './AccountCard';

const Accounts: React.FC = () => {
  const { accounts, fetchAccounts, fetchingAccounts } = useContext(AppContext2);

  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <>
      <ScreenContainer>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={fetchingAccounts}
              onRefresh={fetchAccounts}
              colors={[theme.colors.primary]}
            />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          stickyHeaderIndices={[0]}
        >
          <ScreenHeader title="Contas" actions={[HideValuesAction()]} />
          <ScreenContent>
            <Text typography="light" color="textLight">
              {accounts.length} Contas
            </Text>
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
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
            text: 'Conta manual',
            onPress: () => navigation.navigate('createAccount'),
          },
        ]}
      />
    </>
  );
};

export default Accounts;
