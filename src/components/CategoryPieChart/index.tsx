import React, { useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import { Data, VictoryPie } from 'victory-native';
import { Transaction, TransactionType } from '../../models';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';
import Avatar from '../Avatar';
import Money from '../Money';
import RowContent from '../RowContent';
import Text from '../Text';
import { ChardContainer, LegendContainer } from './styles';
import { Color } from '../../theme';
import { transactionTypeText } from '../../utils/text';

const INLINE_NUMBER_OF_LINES = 3;

type Variant = 'inline' | 'complete';

export interface CategoryPieChartProps {
  transactions: Transaction[];
  type: TransactionType;
  variant?: Variant;
  onPress?: (categoryId: string) => void;
}

type Data = {
  id: string;
  x: string;
  y: number;
  color: string;
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  transactions,
  type,
  variant,
  onPress,
}) => {
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

    if (filteredTransactions.length === 0) {
      return [
        {
          color: theme.colors[type.toLowerCase() as Color],
          x: transactionTypeText[type],
          y: 0.0001,
        } as Data,
      ];
    }

    filteredTransactions.reduce((res, transaction) => {
      const category =
        getCategoryById(transaction.categoryId) || getDefaultCategoryByType('EXPENSE');

      if (!res[category.id]) {
        res[category.id] = {
          id: category.id,
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
  }, [filteredTransactions, variant, theme.colors, type]);

  const renderSliceLabel = (data: Data) => {
    if (totalValue === 0) {
      return '100%';
    }

    const percentValue = (data.y * 100) / totalValue;

    return percentValue > 1 ? `${percentValue.toFixed(0)}%` : '<1%';
  };

  const handleDataPressed = (data: Data) => {
    setSelected((prev) => (prev === data.x ? '' : data.x));
    if (onPress) onPress(data.id);
  };

  const handleSlicePressed = () => {
    return [
      {
        target: 'data',
        mutation: ({ datum }: { datum: Data }) => {
          handleDataPressed(datum);
        },
      },
    ];
  };

  return (
    <ChardContainer
      style={{ flexDirection: variant === 'inline' ? 'row' : 'column', minHeight: pieSize }}
    >
      <VictoryPie
        data={data}
        height={pieSize}
        width={pieSize}
        padding={piePadding}
        radius={({ datum }) => (datum.x === selected && variant !== 'inline' ? 1.1 : 1) * pieRadius}
        innerRadius={variant === 'inline' ? 25 : 50}
        cornerRadius={5}
        labels={({ datum }) => renderSliceLabel(datum)}
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
            onPress={() => handleDataPressed(item)}
          >
            <Text ellipsize={true}>{item.x}</Text>
            <Money value={item.y} typography={variant !== 'inline' ? 'defaultBold' : 'default'} />
          </RowContent>
        ))}
      </LegendContainer>
    </ChardContainer>
  );
};

export default CategoryPieChart;
