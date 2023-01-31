import React, { Children } from 'react';
import { View, ViewProps } from 'react-native';

export type Direction = 'row' | 'column';

export interface FlexContainerProps extends ViewProps {
  direction?: Direction;
  gap?: number;
}

const FlexContainer: React.FC<FlexContainerProps> = ({ direction, gap, children }) => {
  const containerStyle = { flexDirection: direction || 'column' };

  const marginProp = direction === 'row' ? 'marginRight' : 'marginBottom';
  const appendStyle = { [marginProp]: gap || 0 };

  const mappedChildren = Children.map(children, (child, index) => {
    const isValid = React.isValidElement(child);
    const isLast = !Array.isArray(children) || index === children.length - 1;

    if (!isValid || isLast) {
      return child;
    }

    const childProps = { ...child.props, ...{ style: appendStyle } };

    return React.cloneElement(child, {
      ...child.props,
      ...childProps,
    });
  });

  return <View style={containerStyle}>{mappedChildren}</View>;
};

export default FlexContainer;
