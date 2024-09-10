import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import Money from '../../../../components/Money';
import Text from '../../../../components/Text';
import AppContext from '../../../../contexts/AppContext';
import { BalanceContainer, BalanceFillLine, BalanceLine, ConnectionsButton } from './styles';

const BalanceSection: React.FC = () => {
  const { totalBalance, totalInvoice } = useContext(AppContext);
  const navigation = useNavigation();

  const totalInvestment = 0;

  return (
    <BalanceContainer>
      <BalanceLine>
        <Text color="textWhite">Saldo das contas</Text>
        <BalanceFillLine />
        <Money value={totalBalance} color="textWhite" />
      </BalanceLine>
      <BalanceLine>
        <Text color="textWhite">Fatura dos cartões</Text>
        <BalanceFillLine />
        <Money value={-1 * totalInvoice} color="textWhite" />
      </BalanceLine>
      <BalanceLine>
        <Text color="textWhite">Investimentos</Text>
        <BalanceFillLine />
        <Money value={totalInvestment} color="textWhite" />
      </BalanceLine>
      <BalanceLine>
        <Text typography="title" color="textWhite">
          Total
        </Text>
        <BalanceFillLine />
        <Money
          value={totalBalance + totalInvestment - totalInvoice}
          typography="title"
          color="textWhite"
        />
      </BalanceLine>
      <ConnectionsButton
        text="Ver minhas carteiras"
        color="secondary"
        icon="account-balance-wallet"
        onPress={() => navigation.navigate('wallets')}
      />
    </BalanceContainer>
  );
};

export default BalanceSection;
