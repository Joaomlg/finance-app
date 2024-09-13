import React, { useContext, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import { Data, VictoryChart, VictoryContainer, VictoryPie } from 'victory-native';
import Avatar from '../../../../components/Avatar';
import Money from '../../../../components/Money';
import RowContent from '../../../../components/RowContent';
import Text from '../../../../components/Text';
import AppContext from '../../../../contexts/AppContext';
import { getCategoryById, getDefaultCategoryByType } from '../../../../utils/category';
import { SectionHeader } from '../commonStyles';
import { ChardContainer, Container, LegendContainer } from './styles';
import { TouchableWithoutFeedback, View } from 'react-native';

export type CategorySectionProps = {
  numberOfCategories?: number;
};

type Data = {
  x: string;
  y: number;
  color: string;
};

const CategorySection: React.FC<CategorySectionProps> = ({ numberOfCategories }) => {
  const [selected, setSelected] = useState('');

  const { expenseTransactions, totalExpenses } = useContext(AppContext);
  const theme = useTheme();

  const data = useMemo(() => {
    const result = [] as Data[];

    expenseTransactions.reduce((res, transaction) => {
      const category =
        getCategoryById(transaction.categoryId) || getDefaultCategoryByType('EXPENSE');

      if (!res[category.id]) {
        res[category.id] = {
          x: category.name,
          y: 0,
          color: category.color,
        };
        result.push(res[category.id]);
      }

      res[category.id].y += Math.abs(transaction.amount);

      return res;
    }, {} as Record<string, Data>);

    return result;
  }, [expenseTransactions]);

  const handleWhiteSpacePressed = () => {
    setSelected('');
  };

  const handleSlicePressed = () => {
    return [
      {
        target: 'data',
        mutation: ({ datum }) => {
          setSelected((prev) => (prev === datum.x ? '' : datum.x));
        },
      },
    ];
  };

  return (
    <TouchableWithoutFeedback onPress={handleWhiteSpacePressed}>
      <View>
        <SectionHeader>
          <Text typography="title">Despesas por categoria</Text>
        </SectionHeader>
        <ChardContainer>
          <VictoryChart
            height={300}
            containerComponent={<VictoryContainer disableContainerEvents />}
          >
            <VictoryPie
              data={data}
              innerRadius={50}
              cornerRadius={5}
              labels={({ datum }) => `${((datum.y * 100) / totalExpenses).toFixed(0)}%`}
              padAngle={2}
              style={{
                data: {
                  fill: ({ datum }) => datum.color,
                  fillOpacity: ({ datum }) => (datum.x === selected || selected === '' ? 1 : 0.5),
                },
                labels: {
                  opacity: ({ datum }) => (datum.x === selected ? 1 : 0),
                  fill: theme.colors.text,
                  fontSize: theme.text.default,
                  fontWeight: 'bold',
                },
              }}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: handleSlicePressed,
                  },
                },
              ]}
            />
          </VictoryChart>
        </ChardContainer>
        <LegendContainer>
          {data
            .sort((a, b) => b.y - a.y)
            .map((item, index) => (
              <RowContent
                key={index}
                renderLeftIcon={() => <Avatar color={item.color} fill={item.color} size={12} />}
                text={item.x}
                style={{
                  opacity: item.x === selected || selected === '' ? 1 : 0.5,
                }}
                onPress={() => setSelected((prev) => (prev === item.x ? '' : item.x))}
              >
                <Money value={-item.y} typography="defaultBold" />
              </RowContent>
            ))}
        </LegendContainer>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CategorySection;
