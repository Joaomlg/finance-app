export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      connections: undefined;
      connect:
        | {
            updateConnectionId?: string;
          }
        | undefined;
      manualConnect: undefined;
      transactions: undefined;
      history: undefined;
    }
  }
}
