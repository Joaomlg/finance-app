import React from 'react';

import { ViewProps } from 'react-native';
import Divider from '../../../Divider';
import Icon, { IconName } from '../../../Icon';
import Text from '../../../Text';
import { Container, Item, ItemDividerContainer, Title } from './styles';

export type SelectionItem = {
  text: string;
  onPress: () => void;
  icon?: IconName;
  renderIcon?: () => React.ReactNode;
};

export interface ListItemSelectionProps extends ViewProps {
  items: SelectionItem[];
  title?: string;
}

const ListItemSelection: React.FC<ListItemSelectionProps> = ({ items, title }) => {
  return (
    <Container>
      {title && <Title typography="title">{title}</Title>}
      {items.map((item, index) => (
        <ItemDividerContainer key={index}>
          <Item onPress={item.onPress}>
            {item.icon ? <Icon name={item.icon} size={24} /> : item.renderIcon && item.renderIcon()}
            <Text>{item.text}</Text>
          </Item>
          {index < items.length - 1 && <Divider />}
        </ItemDividerContainer>
      ))}
    </Container>
  );
};

export default ListItemSelection;
