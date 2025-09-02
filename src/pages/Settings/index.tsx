import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import Divider from '../../components/Divider';
import Icon from '../../components/Icon';
import RowContent from '../../components/RowContent';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContent from '../../components/ScreenContent';
import ScreenHeader from '../../components/ScreenHeader';
import Text from '../../components/Text';
import AppContext from '../../contexts/AppContext';
import AuthContext from '../../contexts/AuthContext';
import { Avatar, UserContainer, UserInfo } from './styles';

const Settings: React.FC = () => {
  const navigation = useNavigation();

  const { user, signOut } = useContext(AuthContext);
  const { exportTransactions } = useContext(AppContext);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleExport = async () => {
    Alert.alert(
      'Exportar transações?',
      'Deseja exportar todas as transações para um arquivo .csv?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Exportar',
          onPress: exportTransactions,
        },
      ],
      { cancelable: true },
    );
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
        <Divider />
        <RowContent leftIcon="download" text="Exportar transações" onPress={handleExport} />
      </ScreenContent>
    </ScreenContainer>
  );
};

export default Settings;
