import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ViewProps } from 'react-native';
import Text from '../Text';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import { Actions, Container, TitleButton } from './styles';

type Action = {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  onLongPress?: () => void;
  hidden?: boolean;
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
  const [canGoBack, setCanGoBack] = useState(false);

  const theme = useTheme();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setCanGoBack(navigation.canGoBack());
    }, [navigation]),
  );

  return (
    <Container {...viewProps}>
      {!hideGoBackIcon && canGoBack && (
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
          {actions
            .filter((action) => !action.hidden)
            .map((action, index) => (
              <MaterialIcons
                key={index}
                name={action.icon}
                color={theme.colors.textWhite}
                size={28}
                onPress={action.onPress}
                onLongPress={action.onLongPress}
              />
            ))}
        </Actions>
      )}
    </Container>
  );
};

export default Header;
