import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import CategoryIcon from '../../components/CategoryIcon';
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
import AppContext2 from '../../contexts/AppContext2';
import { StackRouteParamList } from '../../routes/stack.routes';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';
import { formatDateHourFull } from '../../utils/date';
import { transactionTypeText } from '../../utils/text';
import { BottomHeader, BottomHeaderContent, InformationGroup } from './styles';

const TransactionDetail: React.FC<NativeStackScreenProps<StackRouteParamList, 'transaction'>> = ({
  route,
  navigation,
}) => {
  const { wallets, transactions, updateTransaction, deleteTransaction } = useContext(AppContext2);

  const transaction = transactions.find(({ id }) => id === route.params.transactionId);

  if (!transaction) return;

  const wallet = wallets.find(({ id }) => id === transaction.walletId);
  const category =
    getCategoryById(transaction.categoryId) || getDefaultCategoryByType(transaction.type);

  const toggleIgnore = async () => {
    updateTransaction(transaction.id, {
      ignore: !transaction.ignore,
    });
  };

  const handleEditTransaction = () => {
    navigation.navigate('setTransaction', {
      transactionId: transaction.id,
      transactionType: transaction.type,
    });
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
      <ScreenContainer>
        <ScreenHeader title="Detalhes" actions={[HideValuesAction()]} />
        <ScreenContent>
          <BottomHeader>
            <CategoryIcon category={category} size={48} />
            <BottomHeaderContent>
              <Text typography="heading">{transaction.description}</Text>
              {category.name && (
                <Text typography="extraLight" color="textLight" selectable={true}>
                  {category.name}
                </Text>
              )}
            </BottomHeaderContent>
          </BottomHeader>
          <InformationGroup>
            <RowContent text="Criado em">
              <Text typography="defaultBold">{formatDateHourFull(moment(transaction.date))}</Text>
            </RowContent>
            <RowContent text="Conta">
              <Text typography="defaultBold">{wallet?.name}</Text>
            </RowContent>
            <RowContent text="Tipo">
              <Text typography="defaultBold">{transactionTypeText[transaction.type]}</Text>
            </RowContent>
          </InformationGroup>
          <Divider />
          <InformationGroup>
            <RowContent text="Valor">
              <Money
                typography="defaultBold"
                value={
                  transaction.type === 'EXPENSE' ? -1 * transaction.amount : transaction.amount
                }
              />
            </RowContent>
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
          { text: 'Remover', icon: 'delete', onPress: handleDeleteTransaction },
        ]}
        icon="more-horiz"
      />
    </>
  );
};

export default TransactionDetail;
