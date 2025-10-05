export type PositionType = 'FIXED_INCOME';

export type TaxType = 'CDI';

export type FixedIncomePosition = {
  id: string;
  name: string;
  type: PositionType;
  investedAmount: number;
  quantity: number;
  marketValue: number;
  taxRate: number;
  taxType: TaxType;
  date: Date;
  dueDate: Date;
  accountId: string;
};
