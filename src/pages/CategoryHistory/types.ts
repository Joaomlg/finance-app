import { Moment } from 'moment';

export type MonthData = {
  date: Moment;
  amount: number;
};

export type CategoryAnnualBalance = {
  year: number;
  amount: number;
  data: MonthData[];
  complete: boolean;
};
