import React, { useState } from 'react';
import { ActivityIndicator, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import Icon, { IconName } from '../Icon';
import Text from '../Text';
import {
  Container,
  FLoatingActionButton,
  FloatingActionContainer,
  FloatingActionText,
  FloatingButton,
  OverlayContainer,
} from './styles';
import { useTheme } from 'styled-components';

export type Action = {
  text: string;
  icon: IconName;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  hidden?: boolean;
};

export interface ScreenFloatingButtonProps {
  icon?: IconName;
  closeIcon?: IconName;
  actions?: Action[];
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const DEFAULT_ICON: IconName = 'add';
const DEFAULT_CLOSE_ICON: IconName = 'close';

const CLOSE_ON_ACTION_PRESS_DELAY_MS = 100;

const ScreenFloatingButton: React.FC<ScreenFloatingButtonProps> = ({
  icon,
  closeIcon,
  actions,
  onPress,
  loading,
  disabled,
}) => {
  const [opened, setOpened] = useState(false);

  const theme = useTheme();

  const animatedToogle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpened(!opened);
  };

  const animatedClose = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpened(false);
  };

  const handleButtonPress = () => {
    if (onPress) {
      onPress();
    } else {
      animatedToogle();
    }
  };

  const handleActionPress = (func: (() => void) | undefined) => {
    if (func) func();
    setTimeout(animatedClose, CLOSE_ON_ACTION_PRESS_DELAY_MS);
  };

  const renderFloatingButton = () => {
    return (
      <FloatingButton onPress={handleButtonPress} disabled={disabled}>
        {loading ? (
          <ActivityIndicator size={24} color={theme.colors.textWhite} />
        ) : opened ? (
          <Icon name={closeIcon || DEFAULT_CLOSE_ICON} size={24} color="textWhite" />
        ) : (
          <Icon name={icon || DEFAULT_ICON} size={24} color="textWhite" />
        )}
      </FloatingButton>
    );
  };

  const renderFloatingButtonWithActions = () => {
    return (
      <TouchableWithoutFeedback onPress={animatedClose}>
        <OverlayContainer>
          {actions &&
            opened &&
            actions
              .filter((action) => !action.hidden)
              .map((action, index) => (
                <FloatingActionContainer
                  key={index}
                  onPress={() => !action.disabled && handleActionPress(action.onPress)}
                  onLongPress={() => !action.disabled && handleActionPress(action.onLongPress)}
                  disabled={action.disabled}
                >
                  <FloatingActionText>
                    <Text typography="defaultBold">{action.text}</Text>
                  </FloatingActionText>
                  <FLoatingActionButton>
                    <Icon name={action.icon} size={24} color="text" />
                  </FLoatingActionButton>
                </FloatingActionContainer>
              ))}
          {renderFloatingButton()}
        </OverlayContainer>
      </TouchableWithoutFeedback>
    );
  };

  return opened ? (
    renderFloatingButtonWithActions()
  ) : (
    <Container>{renderFloatingButton()}</Container>
  );
};

export default ScreenFloatingButton;
