import { Connection } from './connection';

export type BankAccount = {
  id: string;
  name: string;
  createdAt: Date;
  styles: {
    imageUrl: string;
    primaryColor: string;
  };
  institutionId?: number;
  connection?: Connection;
};
