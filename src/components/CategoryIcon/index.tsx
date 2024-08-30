import React from 'react';
import { ViewProps } from 'react-native';
import { Category } from '../../models';
import Avatar from '../Avatar';
import Icon, { IconName } from '../Icon';

export interface CategoryIconProps extends ViewProps {
  category: Category;
  size?: number;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size, ...props }) => {
  const avatarSize = size || 36;
  const iconSize = avatarSize * (2 / 3);

  return (
    <Avatar color={category.color} size={avatarSize} {...props}>
      <Icon name={category.icon as IconName} size={iconSize} color={category.color} />
    </Avatar>
  );
};

export default CategoryIcon;
