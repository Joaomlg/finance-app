import { TouchableOpacityProps } from 'react-native';
import styled from 'styled-components/native';

export type FloatingActionContainer = TouchableOpacityProps & {
  disabled?: boolean;
};

export const Container = styled.View`
  height: 100%;
  width: 100%;
  padding: 24px;
  position: absolute;
  gap: 24px;
  align-items: flex-end;
  justify-content: flex-end;
`;

export const OverlayContainer = styled(Container)`
  background-color: ${({ theme }) => theme.colors.overlay};
`;

export const FloatingButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 64px;
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 64px;
`;

export const FloatingActionContainer = styled.TouchableOpacity<FloatingActionContainer>`
  flex-direction: row;
  gap: 24px;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`;

export const FLoatingActionButton = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 48px;
  margin-right: 8px;
`;

export const FloatingActionText = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundWhite};
  padding: 8px 12px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
`;
