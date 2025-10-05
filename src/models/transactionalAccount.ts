export const TransactionalAccountSubtypeList = [
  'CHECKING_ACCOUNT',
  'SAVINGS_ACCOUNT',
  'CREDIT_CARD',
] as const;

export type TransactionalAccountSubtype = typeof TransactionalAccountSubtypeList[number];

export type TransactionalAccount = {
  id: string;
  type: 'TRANSACTIONAL_ACCOUNT';
  subtype: TransactionalAccountSubtype;
  balance: number;
  initialBalance: number;
  bankAccountId: string;
};
