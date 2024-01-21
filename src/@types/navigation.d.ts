export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      connections: undefined;
      'connection-detail': { connectionId: string };
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
    }
  }
}
