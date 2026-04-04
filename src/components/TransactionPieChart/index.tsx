import React, { useCallback, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';
import { CategoryType, Transaction, Wallet } from '../../models';
import { getCategoryById, getDefaultCategoryByType } from '../../utils/category';
import Avatar from '../Avatar';
import Money from '../Money';
import RowContent from '../RowContent';
import Text from '../Text';
import { ChardContainer, LegendContainer, LegendScrollContainer } from './styles';
import { View } from 'react-native';

const INLINE_NUMBER_OF_LINES = 3;

const EMPTY_CHART_LABEL = 'Sem dados';

const UNKNOWN_WALLET_NAME = 'Carteira desconhecida';

type Variant = 'inline' | 'complete';

export interface CategoryPieChartProps {
  type: CategoryType;
  transactions: Transaction[];
  variant?: Variant;
  onPress?: (segmentId: string) => void;
}

export interface WalletPieChartProps {
  wallets: Wallet[];
  transactions: Transaction[];
  variant?: Variant;
  onPress?: (segmentId: string) => void;
}

export interface TransactionPieChartProps {
  transactions: Transaction[];
  getSegmentId: (transaction: Transaction) => string;
  getSegmentName: (transaction: Transaction) => string;
  getSegmentColor: (transaction: Transaction) => string;
  variant?: Variant;
  onPress?: (segmentId: string) => void;
}

type Data = {
  id: string;
  x: string;
  y: number;
  color: string;
};

const TransactionPieChart: React.FC<TransactionPieChartProps> = ({
  transactions,
  getSegmentId,
  getSegmentName,
  getSegmentColor,
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
          color: theme.colors.lightGray,
          x: EMPTY_CHART_LABEL,
          y: 0.0001,
        } as Data,
      ];
    }

    filteredTransactions.reduce((res, transaction) => {
      const id = getSegmentId(transaction);

      if (!res[id]) {
        res[id] = {
          id,
          x: getSegmentName(transaction),
          y: 0,
          color: getSegmentColor(transaction),
        };
        result.push(res[id]);
      }

      res[id].y += Math.abs(transaction.amount);

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
  }, [filteredTransactions, variant, theme.colors, getSegmentId, getSegmentName, getSegmentColor]);

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
    <View style={{ minHeight: pieSize, height: variant === 'inline' ? 'auto' : '100%' }}>
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
        <LegendScrollContainer>
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
                <Money
                  value={item.y}
                  typography={variant !== 'inline' ? 'defaultBold' : 'default'}
                />
              </RowContent>
            ))}
          </LegendContainer>
        </LegendScrollContainer>
      </ChardContainer>
    </View>
  );
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  type,
  transactions,
  variant,
  onPress,
}) => {
  const getSegmentId = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).id,
    [type],
  );
  const getSegmentName = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).name,
    [type],
  );
  const getSegmentColor = useCallback(
    (t: Transaction) => (getCategoryById(t.categoryId) ?? getDefaultCategoryByType(type)).color,
    [type],
  );

  return (
    <TransactionPieChart
      transactions={transactions}
      variant={variant}
      getSegmentId={getSegmentId}
      getSegmentName={getSegmentName}
      getSegmentColor={getSegmentColor}
      onPress={onPress}
    />
  );
};

export const WalletPieChart: React.FC<WalletPieChartProps> = ({
  wallets,
  transactions,
  variant,
  onPress,
}) => {
  const theme = useTheme();

  const getSegmentId = useCallback((t: Transaction) => t.walletId, []);

  const getSegmentName = useCallback(
    (t: Transaction) => wallets.find((w) => w.id === t.walletId)?.name ?? UNKNOWN_WALLET_NAME,
    [wallets],
  );

  const getSegmentColor = useCallback(
    (t: Transaction) =>
      wallets.find((w) => w.id === t.walletId)?.styles.primaryColor ?? theme.colors.lightGray,
    [wallets, theme.colors.lightGray],
  );

  return (
    <TransactionPieChart
      transactions={transactions}
      variant={variant}
      getSegmentId={getSegmentId}
      getSegmentName={getSegmentName}
      getSegmentColor={getSegmentColor}
      onPress={onPress}
    />
  );
};

export default TransactionPieChart;
