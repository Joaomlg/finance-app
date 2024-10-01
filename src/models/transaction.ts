export const TransactionTypeList = ['EXPENSE', 'INCOME'] as const;

export type TransactionType = typeof TransactionTypeList[number];

export type TransactionOriginalValues = {
  date?: Date;
  amount?: number;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
  walletId: string;
  categoryId?: string;
  ignore?: boolean;
  changed?: boolean;
  originalValues?: TransactionOriginalValues;
};
