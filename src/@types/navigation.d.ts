export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      login: undefined;
      home: undefined;
      accounts: undefined;
      accountDetail: { accountId: string };
      createAccount: undefined;
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
