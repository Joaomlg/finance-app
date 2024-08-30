import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import Divider from '../../components/Divider';
import Icon from '../../components/Icon';
import RowContent from '../../components/RowContent';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
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
      <ScreenHeader title="Configurações" />
      <ScreenContent>
        <UserContainer>
          {user?.avatar ? (
            <Avatar source={{ uri: user.avatar }} />
          ) : (
            <Icon name="account-circle" color="text" size={48} />
          )}
          <UserInfo>
            <Text>{user?.name}</Text>
            <Text typography="extraLight">{user?.email}</Text>
          </UserInfo>
          <Icon name="logout" color="text" size={24} onPress={handleSignOut} />
        </UserContainer>
        <Divider />
        <RowContent
          leftIcon="bookmark"
          text="Categorias"
          rightIcon="chevron-right"
          onPress={() => navigation.navigate('categories')}
        />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default Settings;
