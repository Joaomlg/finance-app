import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import FlexContainer from '../../components/FlexContainer';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { Item } from '../../services/pluggy';
import ConnectionCard from '../Connections/ConnectionCard';
import { BottomSheet, StyledHeader } from './styles';

const Connections2: React.FC = () => {
  const { isLoading, items, accounts, hideValues, setHideValues, fetchItems } =
    useContext(AppContext);

  const theme = useTheme();
  const navigation = useNavigation();

  const renderItem = useCallback(
    (item: Item) => {
      const itemAccounts = accounts.filter((account) => account.itemId === item.id);
      return <ConnectionCard key={item.id} item={item} accounts={itemAccounts} />;
    },
    [accounts],
  );

  return (
    <ScreenContainer>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchItems}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <StyledHeader
          title="Conexões"
          actions={[
            {
              icon: hideValues ? 'visibility-off' : 'visibility',
              onPress: () => setHideValues(!hideValues),
            },
            { icon: 'add-circle-outline', onPress: () => navigation.navigate('connect', {}) },
          ]}
        ></StyledHeader>
        <BottomSheet>
          <Text variant="light" color="textLight">
            {items.length} Conexões
          </Text>
          <FlexContainer gap={24}>{items.map((item) => renderItem(item))}</FlexContainer>
        </BottomSheet>
      </ScrollView>
    </ScreenContainer>
  );
};

export default Connections2;
