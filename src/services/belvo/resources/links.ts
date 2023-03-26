import Resource from './resources';
import { Link } from '../types';

/**
 * A Link is a set of credentials associated to a end-user access to an Institution.
 * @extends Resource
 * */
class LinkResource extends Resource<Link> {
  protected endpoint = 'api/links/';
}

export default LinkResource;
