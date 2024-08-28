import React from 'react';
import { SvgProps as RNSvgProps } from 'react-native-svg';
import { SvgWithCssUri } from 'react-native-svg/css';
import { getLocalSvgComponent, isLocalSvgComponent } from '../../utils/svg';

export interface SvgProps extends RNSvgProps {
  src: string;
}

const Svg: React.FC<SvgProps> = ({ src, ...props }) => {
  if (isLocalSvgComponent(src)) {
    const SvgComponent = getLocalSvgComponent(src);
    return <SvgComponent {...props} />;
  } else {
    return <SvgWithCssUri {...props} uri={src} />;
  }
};

export default Svg;
