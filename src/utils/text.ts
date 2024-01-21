import { AccountSubType } from '../models';

export const accountName: Record<AccountSubType, string> = {
  CHECKING_ACCOUNT: 'Conta corrente',
  SAVINGS_ACCOUNT: 'Conta poupança',
  CREDIT_CARD: 'Cartão de crédito',
};

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const textCompare = (text1: string, text2: string) => {
  return text1.localeCompare(text2);
};
