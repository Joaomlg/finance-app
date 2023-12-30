export type TransactionType = 'DEBIT' | 'CREDIT';

export type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category?: string;
  date: Date;
  accountId: string;
};
