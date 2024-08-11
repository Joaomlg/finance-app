import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import Divider from '../../components/Divider';
import Header from '../../components/Header';
import Icon from '../../components/Icon';
import ScreenContainer from '../../components/ScreenContainer';
import { ScreenContent } from '../../components/ScreenContent';
import Text from '../../components/Text';
import AuthContext from '../../contexts/AuthContext';
import { Avatar, UserContainer, UserInfo } from './styles';

const Settings: React.FC = () => {
  const navigation = useNavigation();

  const { user, signOut } = useContext(AuthContext);

  const handleSignOut = async () => {
    await signOut();
    navigation.navigate('login');
  };

  return (
    <ScreenContainer>
      <Header title="Configurações" />
      <ScreenContent>
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
      </ScreenContent>
    </ScreenContainer>
  );
};

export default Settings;
