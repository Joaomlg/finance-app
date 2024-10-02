import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext } from 'react';
import { Alert, View } from 'react-native';
import CategoryIcon from '../../components/CategoryIcon';
import Chip from '../../components/Chip';
import Divider from '../../components/Divider';
import Money from '../../components/Money';
import RowContent from '../../components/RowContent';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenFloatingButton from '../../components/ScreenFloatingButton';
import ScreenHeader from '../../components/ScreenHeader';
import HideValuesAction from '../../components/ScreenHeader/CommonActions/HideValuesAction';
import Switch from '../../components/Switch';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import { Transaction } from '../../models';
import { StackRouteParamList } from '../../routes/stack.routes';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';
import { formatDate } from '../../utils/date';
import { transactionTypeText } from '../../utils/text';
import { BottomHeader, BottomHeaderContent, ChipContainer, InformationGroup } from './styles';

const TransactionDetail: React.FC<NativeStackScreenProps<StackRouteParamList, 'transaction'>> = ({
  route,
  navigation,
}) => {
  const {
    wallets,
    transactions,
    fetchingTransactions,
    fetchTransactions,
    updateTransaction,
    deleteTransaction,
  } = useContext(AppContext);

  const transaction = transactions.find(({ id }) => id === route.params.transactionId);

  if (!transaction) {
    setTimeout(() => {
      navigation.goBack();
    }, 100);
    return;
  }

  const wallet = wallets.find(({ id }) => id === transaction.walletId);
  const category =
    getCategoryById(transaction.categoryId) || getDefaultCategoryByType(transaction.type);

  const isAutomaticTransaction = wallet?.connection !== undefined;

  const toggleIgnore = async () => {
    await updateTransaction(transaction.id, {
      ignore: !transaction.ignore,
    });
  };

  const handleEditTransaction = () => {
    navigation.navigate('setTransaction', {
      transactionId: transaction.id,
      transactionType: transaction.type,
    });
  };

  const handleRestoreTransaction = () => {
    Alert.alert(
      'Restaurar transação?',
      'Tem certeza que deseja restaurar os dados da transação?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Restaurar',
          onPress: async () => {
            await updateTransaction(transaction.id, {
              changed: false,
              ...transaction.originalValues,
              originalValues: undefined,
            } as Transaction);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleDeleteTransaction = async () => {
    Alert.alert(
      'Apagar transação?',
      'Tem certeza que deseja apagar a transação?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Apagar',
          onPress: async () => {
            await deleteTransaction(transaction);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <ScreenContainer refreshing={fetchingTransactions} onRefresh={fetchTransactions}>
        <ScreenHeader title="Detalhes" actions={[HideValuesAction()]} />
        <ScreenContent>
          <BottomHeader>
            <CategoryIcon category={category} size={48} />
            <BottomHeaderContent>
              <Text typography="heading">{transaction.description}</Text>
              <Text typography="extraLight" color="textLight" selectable={true}>
                {transaction.id}
              </Text>
            </BottomHeaderContent>
          </BottomHeader>
          {isAutomaticTransaction && (
            <ChipContainer>
              <Chip text="Automático" color="primary" />
              {transaction.changed && <Chip text="Alterado" color="lightGray" />}
            </ChipContainer>
          )}
          <InformationGroup>
            <View>
              <RowContent text="Data">
                <Text typography="defaultBold">{formatDate(moment(transaction.date))}</Text>
              </RowContent>
              {transaction.changed && transaction.originalValues?.date && (
                <RowContent>
                  <Text typography="extraLight">Data original</Text>
                  <Text typography="extraLight">
                    {formatDate(moment(transaction.originalValues.date))}
                  </Text>
                </RowContent>
              )}
            </View>
            <RowContent text="Conta">
              <Text typography="defaultBold">{wallet?.name}</Text>
            </RowContent>
            <RowContent text="Tipo">
              <Text typography="defaultBold">{transactionTypeText[transaction.type]}</Text>
            </RowContent>
            <RowContent text="Categoria">
              <Text typography="defaultBold">{category.name}</Text>
            </RowContent>
          </InformationGroup>
          <Divider />
          <InformationGroup>
            <View>
              <RowContent text="Valor">
                <Money typography="defaultBold" value={Math.abs(transaction.amount)} />
              </RowContent>
              {transaction.changed && transaction.originalValues?.amount && (
                <RowContent>
                  <Text typography="extraLight">Valor original</Text>
                  <Money
                    typography="extraLight"
                    value={Math.abs(transaction.originalValues.amount)}
                  />
                </RowContent>
              )}
            </View>
          </InformationGroup>
          <Divider />
          <RowContent text="Ignorar transação">
            <Switch onValueChange={toggleIgnore} value={transaction.ignore} />
          </RowContent>
        </ScreenContent>
      </ScreenContainer>
      <ScreenFloatingButton
        actions={[
          { text: 'Editar', icon: 'edit', onPress: handleEditTransaction },
          {
            text: 'Restaurar',
            icon: 'undo',
            hidden: !transaction.changed,
            onPress: handleRestoreTransaction,
          },
          {
            text: 'Remover',
            icon: 'delete',
            hidden: isAutomaticTransaction,
            onPress: handleDeleteTransaction,
          },
        ]}
        icon="more-horiz"
      />
    </>
  );
};

export default TransactionDetail;
