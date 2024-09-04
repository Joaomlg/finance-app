import React from 'react';
import { Category, CategoryType } from '../../models';
import { getPresetCategoriesByType } from '../../utils/category';
import CategoryIcon from '../CategoryIcon';
import ListItemSelection, { SelectionItem } from '../Forms/Selection/ListItemSelection';

export interface CategoryPickerProps {
  type: CategoryType;
  onPress: (category: Category) => void;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ type, onPress }) => {
  const categories = getPresetCategoriesByType(type);

  const items: SelectionItem[] = categories.map((category) => ({
    text: category.name,
    renderIcon: () => <CategoryIcon category={category} />,
    onPress: () => onPress(category),
  }));

  return <ListItemSelection title="Categoria" items={items} />;
};

export default CategoryPicker;
