export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      login: undefined;
      home: undefined;
      wallets: undefined;
      wallet: { walletId: string };
      setWallet: { walletId?: string } | undefined;
      connect: undefined;
      'connect/pluggy':
        | {
            updateConnectionId?: string;
          }
        | undefined;
      'connect/belvo':
        | {
            updateConnectionId?: string;
          }
        | undefined;
      manualConnect: undefined;
      transactions: { categoryId?: string } | undefined;
      transaction: { transactionId: string };
      setTransaction: { transactionType: string; transactionId?: string };
      history: undefined;
      settings: undefined;
      categories: undefined;
      insights: undefined;
      categoryHistory: { categoryId: string };
    }
  }
}
