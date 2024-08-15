import React, { useState } from 'react';
import { LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
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

export type Action = {
  text: string;
  icon: IconName;
  onPress?: () => void;
  onLongPress?: () => void;
};

export interface ScreenFloatingButtonProps {
  icon?: IconName;
  closeIcon?: IconName;
  actions?: Action[];
  onPress?: () => void;
}

const DEFAULT_ICON: IconName = 'add';
const DEFAULT_CLOSE_ICON: IconName = 'close';

const CLOSE_ON_ACTION_PRESS_DELAY_MS = 100;

const ScreenFloatingButton: React.FC<ScreenFloatingButtonProps> = ({
  icon,
  closeIcon,
  actions,
  onPress,
}) => {
  const [opened, setOpened] = useState(false);

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
      <FloatingButton onPress={handleButtonPress}>
        {opened ? (
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
            actions.map((action, index) => (
              <FloatingActionContainer
                key={index}
                onPress={() => handleActionPress(action.onPress)}
                onLongPress={() => handleActionPress(action.onLongPress)}
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