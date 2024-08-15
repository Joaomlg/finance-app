import React from 'react';

import { ViewProps } from 'react-native';
import Divider from '../../../Divider';
import Icon, { IconName } from '../../../Icon';
import Text from '../../../Text';
import { Container, Item, ItemDividerContainer, Title } from './styles';

export type Item = {
  text: string;
  icon: IconName;
  onPress: () => void;
};

export interface ListItemSelectionProps extends ViewProps {
  items: Item[];
  title?: string;
}

const ListItemSelection: React.FC<ListItemSelectionProps> = ({ items, title }) => {
  return (
    <Container>
      {title && <Title typography="title">{title}</Title>}
      {items.map((item, index) => (
        <ItemDividerContainer key={index}>
          <Item onPress={item.onPress}>
            <Icon name={item.icon} size={24} />
            <Text>{item.text}</Text>
          </Item>
          {index < items.length - 1 && <Divider />}
        </ItemDividerContainer>
      ))}
    </Container>
  );
};

export default ListItemSelection;
