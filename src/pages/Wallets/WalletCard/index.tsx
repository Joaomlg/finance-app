import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Card from '../../../components/Card';
import Divider from '../../../components/Divider';
import Money from '../../../components/Money';
import Text from '../../../components/Text';
import { Wallet } from '../../../models';
import { LastUpdateDateFormat } from '../../../utils/contants';

import Avatar from '../../../components/Avatar';
import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import RowContent from '../../../components/RowContent';
import { getSvgComponent } from '../../../utils/svg';
import { ConnectionStatusMessage, walletTypeText } from '../../../utils/text';
import { CardContainer, CardContent, CardHeader, CardHeaderContent } from './styles';

export interface WalletCardProps extends ViewProps {
  wallet: Wallet;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, ...viewProps }) => {
  const navigation = useNavigation();

  const LogoSvgComponent = getSvgComponent(wallet.styles.logoSvg);

  const lastUpdateDate = wallet.connection?.lastUpdatedAt
    ? moment(wallet.connection?.lastUpdatedAt).format(LastUpdateDateFormat)
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
              <LogoSvgComponent height="100%" width="100%" />
            </Avatar>
            <CardHeaderContent>
              <Text>{wallet.name}</Text>
              {wallet.connection && (
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
