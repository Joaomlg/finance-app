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
import { Wallet, WalletGroup } from '../../../models';
import { formatDateHourFull } from '../../../utils/date';
import WalletItem from '../WalletItem';
import { Container, Content, Header, HeaderContent, HeaderContentName } from './styles';

export interface WalletGroupCardProps extends TouchableOpacityProps {
  walletGroup: WalletGroup;
  wallets: Wallet[];
}

const WalletGroupCard: React.FC<WalletGroupCardProps> = ({
  walletGroup,
  wallets,
  ...otherProps
}) => {
  const navigation = useNavigation();

  const isAutomatic = walletGroup.type === 'AUTOMATIC';

  const lastUpdateDate =
    isAutomatic && walletGroup.lastUpdatedAt
      ? formatDateHourFull(moment(walletGroup.lastUpdatedAt))
      : 'nunca';

  const hasError =
    isAutomatic && walletGroup.status !== 'UPDATED' && walletGroup.status !== 'UPDATING';

  const handlePressed = () => {
    navigation.navigate('wallet', { walletGroupId: walletGroup.id });
  };

  return (
    <Container onPress={handlePressed} {...otherProps}>
      <Header>
        <Avatar color={walletGroup.styles.primaryColor}>
          <Svg height="100%" width="100%" src={walletGroup.styles.imageUrl} />
        </Avatar>
        <HeaderContent>
          <HeaderContentName>
            <Text ellipsize={true}>{walletGroup.name}</Text>
            <Icon name={isAutomatic ? 'link' : 'link-off'} size={18} />
          </HeaderContentName>
          {isAutomatic &&
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
      {isAutomatic && !!walletGroup.investmentAmount && (
        <RowContent text="Investimentos">
          <Money typography="defaultBold" value={walletGroup.investmentAmount} />
        </RowContent>
      )}
      <Content>
        {wallets.map((wallet) => (
          <WalletItem key={wallet.id} wallet={wallet} />
        ))}
      </Content>
    </Container>
  );
};

export default WalletGroupCard;
