import React from 'react';
import { ViewProps } from 'react-native';
import Money from '../../../components/Money';
import RowContent from '../../../components/RowContent';
import { Wallet } from '../../../models';
import { walletTypeText } from '../../../utils/text';
import { Container } from './styles';

export interface WalletItemProps extends ViewProps {
  wallet: Wallet;
}

const WalletItem: React.FC<WalletItemProps> = ({ wallet, ...otherProps }) => {
  return (
    <Container {...otherProps}>
      <RowContent text={walletTypeText[wallet.type]}>
        <Money
          typography="defaultBold"
          value={wallet.type === 'CREDIT_CARD' ? -1 * wallet.balance : wallet.balance}
        />
      </RowContent>
    </Container>
  );
};

export default WalletItem;
