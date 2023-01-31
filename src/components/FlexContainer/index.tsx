import React, { Children } from 'react';
import { View, ViewProps } from 'react-native';

export type Direction = 'row' | 'column';

export interface FlexContainerProps extends ViewProps {
  direction?: Direction;
  gap?: number;
}

const FlexContainer: React.FC<FlexContainerProps> = ({
  direction,
  gap,
  children,
  style: externalStyle,
  ...viewProps
}) => {
  const containerStyle = { flexDirection: direction || 'column' };

  const marginProp = direction === 'row' ? 'marginRight' : 'marginBottom';
  const appendStyle = { [marginProp]: gap };

  const mappedChildren =
    gap === undefined
      ? children
      : Children.map(children, (child, index) => {
          const isValid = React.isValidElement(child);
          const isLast = !Array.isArray(children) || index === children.length - 1;

          if (!isValid || isLast) {
            return child;
          }

          return React.cloneElement(child, {
            ...child.props,
            style: appendStyle,
          });
        });

  return (
    <View style={[externalStyle, containerStyle]} {...viewProps}>
      {mappedChildren}
    </View>
  );
};

export default FlexContainer;
