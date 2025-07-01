import { MonthlyBalance } from '../../contexts/AppContext';

export type AnnualBalance = {
  year: number;
  incomes: number;
  expenses: number;
  data: MonthlyBalance[];
  complete: boolean;
};
