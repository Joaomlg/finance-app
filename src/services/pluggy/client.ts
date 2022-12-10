import { PluggyClient } from 'pluggy-sdk';
import { CLIENT_ID, CLIENT_SECRET } from '@env';

const client = new PluggyClient({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
})

export default client;