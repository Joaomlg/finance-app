import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Card from '../../../components/Card';
import Divider from '../../../components/Divider';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import { NewAccount } from '../../../models';
import { LastUpdateDateFormat } from '../../../utils/contants';

import Avatar from '../../../components/Avatar';
import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import { getSvgComponent } from '../../../utils/svg';
import { ConnectionStatusMessage, accountName, textCompare } from '../../../utils/text';
import { CardContainer, CardContent, CardHeader, CardHeaderContent, Line } from './styles';

export interface AccountCardProps extends ViewProps {
  account: NewAccount;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, ...viewProps }) => {
  const navigation = useNavigation();

  const LogoSvgComponent = getSvgComponent(account.logoSvg);

  const lastUpdateDate = account.connection?.lastUpdatedAt
    ? moment(account.connection?.lastUpdatedAt).format(LastUpdateDateFormat)
    : 'nunca';

  const hasError =
    account.connection?.status !== 'UPDATED' && account.connection?.status !== 'UPDATING';

  const handleCardPressed = () => {
    navigation.navigate('accountDetail', { accountId: account.id });
  };

  return (
    <>
      <Card {...viewProps} onPress={handleCardPressed}>
        {account.connection && hasError && (
          <Banner
            icon="error"
            message="Não foi possível sincronizar os dados!"
            message2={ConnectionStatusMessage[account.connection?.status]}
          />
        )}
        <CardContainer>
          <CardHeader>
            <Avatar color={account.primaryColor}>
              <LogoSvgComponent height="100%" width="100%" />
            </Avatar>
            <CardHeaderContent>
              <Text>{account.name}</Text>
              {account.connection && (
                <Text typography="extraLight" color="textLight">
                  Sincronizado em: {lastUpdateDate}
                </Text>
              )}
            </CardHeaderContent>
            <TouchableOpacity>
              <Icon name="navigate-next" size={24} />
            </TouchableOpacity>
          </CardHeader>
          <Divider />
          <CardContent>
            {account.wallets
              .sort((a, b) => textCompare(a.subtype, b.subtype))
              .map((wallet, index) => (
                <Line key={index}>
                  <Text>{accountName[wallet.subtype]}</Text>
                  <Money
                    typography="defaultBold"
                    value={wallet.subtype === 'CREDIT_CARD' ? -1 * wallet.balance : wallet.balance}
                  />
                </Line>
              ))}
          </CardContent>
        </CardContainer>
      </Card>
    </>
  );
};

export default AccountCard;
