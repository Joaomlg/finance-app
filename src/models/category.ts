import { TransactionType } from './transaction';

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
};
