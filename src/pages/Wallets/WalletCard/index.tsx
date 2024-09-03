import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { ViewProps } from 'react-native';
import Avatar from '../../../components/Avatar';
import Banner from '../../../components/Banner';
import Card from '../../../components/Card';
import Divider from '../../../components/Divider';
import Icon from '../../../components/Icon';
import Money from '../../../components/Money';
import RowContent from '../../../components/RowContent';
import Svg from '../../../components/Svg';
import Text from '../../../components/Text';
import { Wallet } from '../../../models';
import { formatDateHourFull } from '../../../utils/date';
import { ConnectionStatusMessage, walletTypeText } from '../../../utils/text';
import {
  CardContainer,
  CardContent,
  CardHeader,
  CardHeaderContent,
  CardHeaderContentName,
} from './styles';

export interface WalletCardProps extends ViewProps {
  wallet: Wallet;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, ...viewProps }) => {
  const navigation = useNavigation();

  const lastUpdateDate = wallet.connection?.lastUpdatedAt
    ? formatDateHourFull(moment(wallet.connection?.lastUpdatedAt))
    : 'nunca';

  const hasError =
    wallet.connection?.status !== 'UPDATED' && wallet.connection?.status !== 'UPDATING';

  const handleCardPressed = () => {
    navigation.navigate('wallet', { walletId: wallet.id });
  };

  return (
    <>
      <Card {...viewProps} onPress={handleCardPressed}>
        {wallet.connection && hasError && (
          <Banner
            icon="error"
            message="Não foi possível sincronizar os dados!"
            message2={ConnectionStatusMessage[wallet.connection?.status]}
          />
        )}
        <CardContainer>
          <CardHeader>
            <Avatar color={wallet.styles.primaryColor}>
              <Svg height="100%" width="100%" src={wallet.styles.imageUrl} />
            </Avatar>
            <CardHeaderContent>
              <CardHeaderContentName>
                <Text>{wallet.name}</Text>
                <Icon name={wallet.connection ? 'link' : 'link-off'} size={18} />
              </CardHeaderContentName>
              {wallet.connection && (
                <Text typography="extraLight" color="textLight">
                  Sincronizado em: {lastUpdateDate}
                </Text>
              )}
            </CardHeaderContent>
            <Icon name="navigate-next" size={24} />
          </CardHeader>
          <Divider />
          <CardContent>
            <RowContent text={walletTypeText[wallet.type]}>
              <Money
                typography="defaultBold"
                value={wallet.type === 'CREDIT_CARD' ? -1 * wallet.balance : wallet.balance}
              />
            </RowContent>
          </CardContent>
        </CardContainer>
      </Card>
    </>
  );
};

export default WalletCard;
