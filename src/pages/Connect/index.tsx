import { useNavigation } from '@react-navigation/native';
import React from 'react';
import BelvoLogo from '../../assets/icon/belvo_logo.svg';
import PluggyLogo from '../../assets/icon/pluggy_logo.svg';
import Header from '../../components/Header';
import ScreenContainer from '../../components/ScreenContainer';
import { ScreenContent } from '../../components/ScreenContent';
import Text from '../../components/Text';
import { CustomCard } from './styles';

const Connect: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer>
      <Header title="Connectar" />
      <ScreenContent>
        <Text variant="title">Selecione um provedor</Text>
        <CustomCard onPress={() => navigation.navigate('connect/pluggy')}>
          <PluggyLogo height={36} width={130} />
        </CustomCard>
        <CustomCard onPress={() => navigation.navigate('connect/belvo')}>
          <BelvoLogo height={36} width={100} />
        </CustomCard>
      </ScreenContent>
    </ScreenContainer>
  );
};

export default Connect;
