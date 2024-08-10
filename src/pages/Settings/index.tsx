import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import Divider from '../../components/Divider';
import Icon from '../../components/Icon';
import ScreenContainer from '../../components/ScreenContainer';
import Text from '../../components/Text';
import AuthContext from '../../contexts/AuthContext';
import { Avatar, BottomSheet, StyledHeader, UserContainer, UserInfo } from './styles';

const Settings: React.FC = () => {
  const navigation = useNavigation();

  const { user, signOut } = useContext(AuthContext);

  const handleSignOut = async () => {
    await signOut();
    navigation.navigate('login');
  };

  return (
    <ScreenContainer>
      <StyledHeader title="Configurações" />
      <BottomSheet>
        <UserContainer>
          {user?.avatar ? (
            <Avatar source={{ uri: user.avatar }} />
          ) : (
            <Icon name="account-circle" color="text" size={48} />
          )}
          <UserInfo>
            <Text>{user?.name}</Text>
            <Text variant="extra-light">{user?.email}</Text>
          </UserInfo>
          <Icon name="logout" color="text" size={24} onPress={handleSignOut} />
        </UserContainer>
        <Divider />
      </BottomSheet>
    </ScreenContainer>
  );
};

export default Settings;
