import { ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { Color } from '../../theme';

export interface AvatarProps extends ViewProps {
  color?: Color | string;
  fill?: Color | string;
  size?: number;
}

export const Avatar = styled.View<AvatarProps>`
  border-style: solid;
  border-width: 1px;
  border-color: ${({ theme, ...props }) => theme.colors[props.color as Color] || props.color};
  border-radius: 100px;
  height: ${(props) => (props.size ? `${props.size}px` : '32px')};
  width: ${(props) => (props.size ? `${props.size}px` : '32px')};
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, ...props }) =>
    props.fill ? theme.colors[props.fill as Color] || props.fill : 'transparent'};
`;

export default Avatar;
