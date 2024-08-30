import { Transaction } from '../models';

export type FormatMoneyProps = {
  value: number;
  absolute?: boolean;
  hidden?: boolean;
};

export const formatMoney = ({ value, absolute, hidden }: FormatMoneyProps) => {
  if (hidden) {
    return '••••••••';
  }

  return (absolute ? Math.abs(value) : value)
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const getTransactionSignedAmount = (transaction: Transaction) => {
  return transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;
};
