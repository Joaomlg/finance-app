import React from 'react';
import { ListRenderItemInfo } from 'react-native';
import CategoryIcon from '../../components/CategoryIcon';
import RowContent from '../../components/RowContent';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenTabs, { TabProps } from '../../components/ScreenTabs';
import Text from '../../components/Text';
import { Category, CategoryType, CategoryTypeList } from '../../models';
import { getPresetCategoriesByType } from '../../utils/category';
import { transactionTypeText } from '../../utils/text';
import { StyledFlatList } from './styles';

const Categories: React.FC = () => {
  const tabs = CategoryTypeList.map(
    (type) =>
      ({
        key: type,
        title: transactionTypeText[type],
      } as TabProps),
  );

  const renderListItem = ({ item }: ListRenderItemInfo<Category>) => (
    <RowContent text={item.name} renderLeftIcon={() => <CategoryIcon category={item} />} />
  );

  const renderScene = (tabKey: string) => {
    const data = getPresetCategoriesByType(tabKey as CategoryType);

    const renderListHeader = () => (
      <Text typography="light" color="textLight">
        {data.length} categorias
      </Text>
    );

    return (
      <StyledFlatList
        data={data}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
      />
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Categorias" />
      <ScreenTabs tabs={tabs} renderScene={renderScene} />
    </ScreenContainer>
  );
};

export default Categories;
