import React, { useMemo, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'styled-components';
import { Data, VictoryPie } from 'victory-native';
import { Transaction } from '../../models';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';
import Avatar from '../Avatar';
import Money from '../Money';
import RowContent from '../RowContent';
import Text from '../Text';
import { ChardContainer, LegendContainer } from './styles';

const INLINE_NUMBER_OF_LINES = 3;

type Variant = 'inline' | 'complete';

export interface CategoryPieChartProps {
  transactions: Transaction[];
  variant?: Variant;
}

type Data = {
  x: string;
  y: number;
  color: string;
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ transactions, variant }) => {
  const [selected, setSelected] = useState('');

  const theme = useTheme();

  const pieSize = variant === 'inline' ? 120 : 300;
  const piePadding = variant === 'inline' ? 0 : 50;
  const pieRadius = 0.5 * pieSize - piePadding;

  const filteredTransactions = transactions.filter((transaction) => !transaction.ignore);

  const totalValue = useMemo(
    () => filteredTransactions.reduce((sum, item) => sum + Math.abs(item.amount), 0),
    [filteredTransactions],
  );

  const data = useMemo(() => {
    const result = [] as Data[];

    filteredTransactions.reduce((res, transaction) => {
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

    const sortedResult = result.sort((a, b) => b.y - a.y);

    if (variant !== 'inline') {
      return sortedResult;
    }

    const limitedData = sortedResult.slice(0, INLINE_NUMBER_OF_LINES);

    const otherData = sortedResult.slice(INLINE_NUMBER_OF_LINES).reduce(
      (res, item) => ({
        ...res,
        y: res.y + item.y,
      }),
      { color: theme.colors.lightGray, x: 'Outros', y: 0 } as Data,
    );

    return [...limitedData, otherData];
  }, [filteredTransactions, variant, theme.colors.lightGray]);

  const handleWhiteSpacePressed = () => {
    setSelected('');
  };

  const handleSlicePressed = () => {
    return [
      {
        target: 'data',
        mutation: ({ datum }: { datum: Data }) => {
          setSelected((prev) => (prev === datum.x ? '' : datum.x));
        },
      },
    ];
  };

  return (
    <TouchableWithoutFeedback onPress={handleWhiteSpacePressed}>
      <ChardContainer style={{ flexDirection: variant === 'inline' ? 'row' : 'column' }}>
        <VictoryPie
          data={data}
          height={pieSize}
          width={pieSize}
          padding={piePadding}
          radius={({ datum }) =>
            (datum.x === selected && variant !== 'inline' ? 1.1 : 1) * pieRadius
          }
          innerRadius={variant === 'inline' ? 25 : 50}
          cornerRadius={5}
          labels={({ datum }) => `${((datum.y * 100) / totalValue).toFixed(0)}%`}
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
        <LegendContainer>
          {data.map((item, index) => (
            <RowContent
              key={index}
              renderLeftIcon={() => <Avatar color={item.color} fill={item.color} size={12} />}
              style={{
                opacity: item.x === selected || selected === '' ? 1 : 0.5,
              }}
              onPress={() => setSelected((prev) => (prev === item.x ? '' : item.x))}
            >
              <Text ellipsize={true}>{item.x}</Text>
              <Money value={item.y} typography={variant !== 'inline' ? 'defaultBold' : 'default'} />
            </RowContent>
          ))}
        </LegendContainer>
      </ChardContainer>
    </TouchableWithoutFeedback>
  );
};

export default CategoryPieChart;
