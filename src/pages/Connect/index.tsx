import { useNavigation } from '@react-navigation/native';
import React from 'react';
import BelvoLogo from '../../assets/icon/belvo_logo.svg';
import PluggyLogo from '../../assets/icon/pluggy_logo.svg';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import { BottomSheet, CustomCard, StyledHeader } from './styles';

const Connect: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScreenContainer>
      <StyledHeader title="Connectar"></StyledHeader>
      <BottomSheet>
        <Text variant="title">Selecione um provedor</Text>
        <CustomCard onPress={() => navigation.navigate('connect/pluggy')}>
          <PluggyLogo height={36} width={130} />
        </CustomCard>
        <CustomCard onPress={() => navigation.navigate('connect/belvo')}>
          <BelvoLogo height={36} width={100} />
        </CustomCard>
      </BottomSheet>
    </ScreenContainer>
  );
};

export default Connect;
