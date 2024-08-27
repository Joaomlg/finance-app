export type TransactionType = 'DEBIT' | 'CREDIT';

export type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
  walletId: string;
  categoryId?: string;
  ignore?: boolean;
};
