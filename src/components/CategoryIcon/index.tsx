import React from 'react';
import { Category } from '../../models';
import Avatar from '../Avatar';
import Icon, { IconName } from '../Icon';

export interface CategoryIconProps {
  category: Category;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  return (
    <Avatar color={category.color} size={36}>
      <Icon name={category.icon as IconName} size={24} color={category.color} />
    </Avatar>
  );
};

export default CategoryIcon;
