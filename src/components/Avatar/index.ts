import { ViewProps } from 'react-native';
import styled from 'styled-components/native';

export interface AvatarProps extends ViewProps {
  color: string;
  size?: number;
}

export const Avatar = styled.View<AvatarProps>`
  border-style: solid;
  border-width: 1px;
  border-color: ${(props) => props.color};
  border-radius: 100px;
  height: ${(props) => (props.size ? `${props.size}px` : '32px')};
  width: ${(props) => (props.size ? `${props.size}px` : '32px')};
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;

export default Avatar;
