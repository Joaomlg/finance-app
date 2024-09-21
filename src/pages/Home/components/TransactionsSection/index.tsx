import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import Text from '../../../../components/Text';
import TransactionListItem from '../../../../components/TransactionListItem';
import AppContext from '../../../../contexts/AppContext';
import { SectionHeader, SeeMoreButton } from '../commonStyles';
import { TransactionListContainer } from './styles';

const NUMBER_OF_TRANSACTIONS = 3;

const TransactionsSection: React.FC = () => {
  const { transactions } = useContext(AppContext);
  const navigation = useNavigation();

  return (
    <>
      <SectionHeader>
        <Text typography="title">Últimas transações</Text>
        <SeeMoreButton text="Ver mais" onPress={() => navigation.navigate('transactions')} />
      </SectionHeader>
      <TransactionListContainer>
        {transactions.slice(0, NUMBER_OF_TRANSACTIONS).map((transaction, index) => (
          <TransactionListItem item={transaction} key={index} />
        ))}
      </TransactionListContainer>
    </>
  );
};

export default TransactionsSection;
