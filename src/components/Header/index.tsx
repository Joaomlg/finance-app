import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ViewProps } from 'react-native';
import Text from '../Text';

import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import { Actions, Container, TitleButton } from './styles';

type Action = {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
};

export interface HeaderProps extends ViewProps {
  title: string;
  titleIcon?: keyof typeof MaterialIcons.glyphMap;
  onTitlePress?: () => void;
  actions?: Action[];
  hideGoBackIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  titleIcon,
  onTitlePress,
  actions,
  hideGoBackIcon,
  ...viewProps
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Container {...viewProps}>
      {!hideGoBackIcon && navigation.canGoBack() && (
        <MaterialIcons
          name="navigate-before"
          color={theme.colors.secondary}
          size={32}
          onPress={() => navigation.goBack()}
        />
      )}
      {onTitlePress ? (
        <TitleButton onPress={onTitlePress}>
          <>
            <Text variant="heading" color="textWhite" transform="capitalize">
              {title}
            </Text>
            <MaterialIcons name={titleIcon} color={theme.colors.secondary} size={28} />
          </>
        </TitleButton>
      ) : (
        <Text variant="heading" color="textWhite" transform="capitalize">
          {title}
        </Text>
      )}

      {actions && (
        <Actions>
          {actions.map((action, index) => (
            <MaterialIcons
              key={index}
              name={action.icon}
              color={theme.colors.textWhite}
              size={28}
              onPress={action.onPress}
            />
          ))}
        </Actions>
      )}
    </Container>
  );
};

export default Header;
