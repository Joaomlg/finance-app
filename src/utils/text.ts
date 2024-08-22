import { AccountSubType, ConnectionStatus, TransactionType } from '../models';

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const textCompare = (text1: string, text2: string) => {
  return text1.localeCompare(text2);
};

export const accountName: Record<AccountSubType, string> = {
  CHECKING_ACCOUNT: 'Conta corrente',
  SAVINGS_ACCOUNT: 'Conta poupança',
  CREDIT_CARD: 'Cartão de crédito',
};

export const transactionName: Record<TransactionType, string> = {
  CREDIT: 'Entrada',
  DEBIT: 'Saída',
};

export const ConnectionStatusMessage: Record<ConnectionStatus, string> = {
  UPDATED: '',
  UPDATING: '',
  LOGIN_ERROR: 'Atualize as credenciais da conexão.',
  WAITING_USER_INPUT: 'Autenticação de duas etapas solicitada.',
  OUTDATED: 'Sincronize a conexão novamente.',
};
