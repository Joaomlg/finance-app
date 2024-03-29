import Provider from './provider';

export type ConnectionStatus =
  | 'UPDATED'
  | 'UPDATING'
  | 'LOGIN_ERROR'
  | 'WAITING_USER_INPUT'
  | 'OUTDATED';

export type Connector = {
  name: string;
  primaryColor: string;
  imageUrl: string;
};

export type Connection = {
  id: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  status: ConnectionStatus;
  connector: Connector;
  provider: Provider;
};
