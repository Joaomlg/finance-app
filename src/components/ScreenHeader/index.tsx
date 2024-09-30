import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ViewProps } from 'react-native';
import Icon, { IconName } from '../Icon';
import Text from '../Text';
import { Actions, Container, Content, TitleButton } from './styles';

export type Action = {
  icon: IconName;
  onPress?: () => void;
  onLongPress?: () => void;
  hidden?: boolean;
};

export interface ScreenHeaderProps extends ViewProps {
  title: string;
  titleIcon?: IconName;
  onTitlePress?: () => void;
  actions?: Action[];
  hideGoBackIcon?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  titleIcon,
  onTitlePress,
  actions,
  hideGoBackIcon,
  ...viewProps
}) => {
  const [canGoBack, setCanGoBack] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setCanGoBack(navigation.canGoBack());
    }, [navigation]),
  );

  return (
    <Container canGoBack={canGoBack} {...viewProps}>
      {!hideGoBackIcon && canGoBack && (
        <Icon
          name="navigate-before"
          color="secondary"
          size={32}
          onPress={() => navigation.goBack()}
        />
      )}
      <Content>
        {onTitlePress ? (
          <TitleButton onPress={onTitlePress}>
            <>
              <Text typography="heading" color="textWhite" ellipsize={true}>
                {title}
              </Text>
              {titleIcon && <Icon name={titleIcon} color="secondary" size={28} />}
            </>
          </TitleButton>
        ) : (
          <Text typography="heading" color="textWhite" ellipsize={true}>
            {title}
          </Text>
        )}
      </Content>
      {actions && (
        <Actions>
          {actions
            .filter((action) => !action.hidden)
            .map((action, index) => (
              <Icon
                key={index}
                name={action.icon}
                color="textWhite"
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

export default ScreenHeader;
