import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useContext, useRef } from 'react';
import { Alert, ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgWithCssUri } from 'react-native-svg';
import { useTheme } from 'styled-components/native';
import Divider from '../../../components/Divider';
import FlexContainer from '../../../components/FlexContainer';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import AppContext from '../../../contexts/AppContext';
import { Account, AccountSubType, Item, ItemStatus } from '../../../services/pluggy';
import { LastUpdateDateFormat } from '../../../utils/contants';
import ConnectionMenu, { Option } from '../ConnectionMenu';

import {
  AccountLine,
  Card,
  CardContent,
  CardErrorContainer,
  CardErrorMessage,
  CardHeader,
  CardHeaderContent,
  ListItemAvatar,
} from './styles';

const accountName: Record<AccountSubType, string> = {
  CHECKING_ACCOUNT: 'Conta corrente',
  SAVINGS_ACCOUNT: 'Conta poupança',
  CREDIT_CARD: 'Cartão de crédito',
};

const itemStatusMessage: Record<ItemStatus, string> = {
  UPDATED: '',
  UPDATING: '',
  LOGIN_ERROR: 'Atualize as credenciais da conexão.',
  WAITING_USER_INPUT: 'Autenticação de duas etapas solicitada.',
  OUTDATED: 'Sincronize a conexão novamente.',
};

export interface ConnectionCardProps extends ViewProps {
  item: Item;
  accounts: Account[];
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ item, accounts, ...viewProps }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { deleteItem } = useContext(AppContext);

  const theme = useTheme();
  const navigation = useNavigation();

  const itemAccounts = accounts.filter((account) => account.itemId === item.id);

  const lastUpdateDate = item.lastUpdatedAt
    ? moment(item.lastUpdatedAt).format(LastUpdateDateFormat)
    : 'nunca';

  const hasError = item.status !== 'UPDATED' && item.status !== 'UPDATING';

  const handleCardOptionPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleUpdateItem = () => {
    navigation.navigate('connect', { updateItemId: item.id });
  };

  const handleDeleteItem = async () => {
    Alert.alert(
      'Apagar conexão?',
      'Tem certeza que deseja apagar a conexão?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Apagar',
          onPress: async () => {
            await deleteItem(item);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleMenuOptionPress = (option: Option) => {
    bottomSheetModalRef.current?.dismiss();

    if (option === 'update') {
      return handleUpdateItem();
    }

    if (option === 'delete') {
      return handleDeleteItem();
    }
  };

  return (
    <>
      <Card {...viewProps}>
        {hasError && (
          <CardErrorContainer>
            <MaterialIcons name="error" size={24} color={theme.colors.textWhite} />
            <CardErrorMessage>
              <Text variant="light" color="textWhite">
                Não foi possível sincronizar os dados!
              </Text>
              <Text variant="light" color="textWhite">
                {itemStatusMessage[item.status]}
              </Text>
            </CardErrorMessage>
          </CardErrorContainer>
        )}
        <CardContent>
          <CardHeader>
            <ListItemAvatar color={'#' + item.connector.primaryColor}>
              <SvgWithCssUri height="100%" width="100%" uri={item.connector.imageUrl} />
            </ListItemAvatar>
            <CardHeaderContent>
              <Text>{item.connector.name}</Text>
              <Text variant="extra-light" color="textLight">
                Sincronizado em: {lastUpdateDate}
              </Text>
            </CardHeaderContent>
            <TouchableOpacity>
              <MaterialIcons
                name="more-vert"
                size={24}
                color={theme.colors.primary}
                onPress={handleCardOptionPress}
              />
            </TouchableOpacity>
          </CardHeader>
          <Divider />
          <FlexContainer gap={16}>
            {itemAccounts.map((account, index) => (
              <AccountLine key={index}>
                <Text>{accountName[account.subtype]}</Text>
                <Money
                  variant="default-bold"
                  value={account.subtype === 'CREDIT_CARD' ? -1 * account.balance : account.balance}
                />
              </AccountLine>
            ))}
          </FlexContainer>
        </CardContent>
      </Card>
      <ConnectionMenu onPress={handleMenuOptionPress} ref={bottomSheetModalRef} />
    </>
  );
};

export default ConnectionCard;
