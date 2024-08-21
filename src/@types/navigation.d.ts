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
      transactions: undefined;
      history: undefined;
      settings: undefined;
    }
  }
}
