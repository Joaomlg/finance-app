import {
  BELVO_CLIENT_ID,
  BELVO_CLIENT_SECRET,
  PLUGGY_CLIENT_ID,
  PLUGGY_CLIENT_SECRET,
} from 'react-native-dotenv';
import Provider from '../models/provider';
import { BelvoClient, BelvoService } from './belvo';
import { PluggyClient, PluggyService } from './pluggy';
import { IProviderService } from './providerService.interface';

export const buildPluggyProviderService = () => {
  return new PluggyService(
    new PluggyClient({
      clientId: PLUGGY_CLIENT_ID,
      clientSecret: PLUGGY_CLIENT_SECRET,
    }),
  );
};

export const buildBelvoProviderService = () => {
  return new BelvoService(
    new BelvoClient(BELVO_CLIENT_ID, BELVO_CLIENT_SECRET, __DEV__ ? 'sandbox' : 'development'),
  );
};

export const getProviderService: (provider: Provider) => IProviderService = (
  provider: Provider,
) => {
  if (provider === 'PLUGGY') {
    return buildPluggyProviderService();
  }

  if (provider === 'BELVO') {
    return buildBelvoProviderService();
  }

  throw 'Invalid provider!';
};
