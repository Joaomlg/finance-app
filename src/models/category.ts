import { TransactionType, TransactionTypeList } from './transaction';

export const CategoryTypeList = TransactionTypeList;

export type CategoryType = TransactionType;

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
};
