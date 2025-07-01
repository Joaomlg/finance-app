import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/Icon';
import Money from '../../../components/Money';
import RowContent from '../../../components/RowContent';
import Svg from '../../../components/Svg';
import Text from '../../../components/Text';
import { Wallet } from '../../../models';
import { formatDateHourFull } from '../../../utils/date';
import { walletTypeText } from '../../../utils/text';
import { Container, Content, Header, HeaderContent, HeaderContentName } from './styles';

export interface WalletItemProps extends TouchableOpacityProps {
  wallet: Wallet;
}

const WalletItem: React.FC<WalletItemProps> = ({ wallet, ...otherProps }) => {
  const navigation = useNavigation();

  const lastUpdateDate = wallet.connection?.lastUpdatedAt
    ? formatDateHourFull(moment(wallet.connection?.lastUpdatedAt))
    : 'nunca';

  const hasError =
    wallet.connection?.status !== 'UPDATED' && wallet.connection?.status !== 'UPDATING';

  const handlePressed = () => {
    navigation.navigate('wallet', { walletId: wallet.id });
  };

  return (
    <>
      <Container {...otherProps} onPress={handlePressed}>
        <Header>
          <Avatar color={wallet.styles.primaryColor}>
            <Svg height="100%" width="100%" src={wallet.styles.imageUrl} />
          </Avatar>
          <HeaderContent>
            <HeaderContentName>
              <Text ellipsize={true}>{wallet.name}</Text>
              <Icon name={wallet.connection ? 'link' : 'link-off'} size={18} />
            </HeaderContentName>
            {wallet.connection &&
              (hasError ? (
                <Text typography="extraLight" color="error">
                  Não foi possível sincronizar os dados!
                </Text>
              ) : (
                <Text typography="extraLight" color="textLight">
                  Sincronizado em: {lastUpdateDate}
                </Text>
              ))}
          </HeaderContent>
          <Icon name="navigate-next" size={24} />
        </Header>
        <Content>
          <RowContent text={walletTypeText[wallet.type]}>
            <Money
              typography="defaultBold"
              value={wallet.type === 'CREDIT_CARD' ? -1 * wallet.balance : wallet.balance}
            />
          </RowContent>
        </Content>
      </Container>
    </>
  );
};

export default WalletItem;
