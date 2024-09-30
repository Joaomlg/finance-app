import { Transaction } from '../models';

export type FormatMoneyProps = {
  value?: number;
  absolute?: boolean;
  hidden?: boolean;
};

export const formatMoney = ({ value, absolute, hidden }: FormatMoneyProps) => {
  if (hidden) {
    return '••••••••';
  }

  const nonUndefinedValue = value || 0;

  return (absolute ? Math.abs(nonUndefinedValue) : nonUndefinedValue)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const getTransactionSignedAmount = (transaction: Transaction) => {
  return transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;
};
