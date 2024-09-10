import { useNavigation } from '@react-navigation/native';
import React, { useContext, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Text from '../../../../components/Text';
import AppContext from '../../../../contexts/AppContext';
import { SectionHeader, SeeMoreButton } from '../commonStyles';
import { TransactionListContainer } from './styles';
import TransactionListItem from '../../../../components/TransactionListItem';

export type TransactionsSectionProps = {
  numberOfTransactions: number;
};

const TRANSACTION_LIST_MIN_CAPACITY = 3;

const TransactionsSection: React.FC<TransactionsSectionProps> = ({ numberOfTransactions }) => {
  const [transactionListCapacity, setTransactionListCapacity] = useState(numberOfTransactions);

  const { transactions } = useContext(AppContext);
  const navigation = useNavigation();

  const lastTransactions = useMemo(() => {
    const amount = Math.max(transactionListCapacity, TRANSACTION_LIST_MIN_CAPACITY);
    return transactions.slice(0, amount);
  }, [transactions, transactionListCapacity]);

  const onTransactionListLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    const listCapacity = Math.round(height / (40 + 24));
    setTransactionListCapacity(listCapacity);
  };

  return (
    <>
      <SectionHeader>
        <Text typography="title">Últimas transações</Text>
        <SeeMoreButton text="Ver mais" onPress={() => navigation.navigate('transactions')} />
      </SectionHeader>
      <TransactionListContainer onLayout={onTransactionListLayout}>
        {lastTransactions.map((transaction, index) => (
          <TransactionListItem item={transaction} key={index} />
        ))}
      </TransactionListContainer>
    </>
  );
};

export default TransactionsSection;
