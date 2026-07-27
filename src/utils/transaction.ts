import { Transaction, Wallet, WalletType } from '../models';

export const UNCATEGORIZED_ID = 'UNCATEGORIZED';

export type TransactionFilters = {
  categoryIds: string[];
  walletGroupIds: string[];
  walletTypes: WalletType[];
  showIgnored: boolean;
};

export const DEFAULT_TRANSACTION_FILTERS: TransactionFilters = {
  categoryIds: [],
  walletGroupIds: [],
  walletTypes: [],
  showIgnored: false,
};

export const countActiveFilters = (filters: TransactionFilters) => {
  return (
    filters.categoryIds.length +
    filters.walletGroupIds.length +
    filters.walletTypes.length +
    (filters.showIgnored ? 1 : 0)
  );
};

export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters,
  wallets: Wallet[],
) => {
  const walletById = new Map(wallets.map((wallet) => [wallet.id, wallet]));

  return transactions.filter((transaction) => {
    const wallet = walletById.get(transaction.walletId);

    if (
      filters.categoryIds.length > 0 &&
      !filters.categoryIds.includes(transaction.categoryId || UNCATEGORIZED_ID)
    ) {
      return false;
    }

    if (
      filters.walletGroupIds.length > 0 &&
      !(wallet && filters.walletGroupIds.includes(wallet.walletGroupId))
    ) {
      return false;
    }

    if (filters.walletTypes.length > 0 && !(wallet && filters.walletTypes.includes(wallet.type))) {
      return false;
    }

    if (!filters.showIgnored && transaction.ignore) {
      return false;
    }

    return true;
  });
};
