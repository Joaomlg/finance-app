export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      connections: undefined;
      connect:
        | {
            updateItemId?: string;
          }
        | undefined;
      manualConnect: undefined;
      transactions: undefined;
      history: undefined;
    }
  }
}
