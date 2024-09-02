import Provider from './provider';

export type ConnectionStatus =
  | 'UPDATED'
  | 'UPDATING'
  | 'LOGIN_ERROR'
  | 'WAITING_USER_INPUT'
  | 'OUTDATED';

export type Connection = {
  id: string;
  lastUpdatedAt: Date;
  updateDisabled: boolean;
  status: ConnectionStatus;
  provider: Provider;
};
