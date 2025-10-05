import { Connection } from './connection';
import { InvestmentAccount } from './investmentAccount';
import { TransactionalAccount } from './transactionalAccount';

export type BankAccount = {
  id: string;
  name: string;
  createdAt: Date;
  financialAccounts: FinancialAccount[];
  styles: {
    imageUrl: string;
    primaryColor: string;
  };
  institutionId?: number;
  connection?: Connection;
};

export type FinancialAccount = TransactionalAccount | InvestmentAccount;
