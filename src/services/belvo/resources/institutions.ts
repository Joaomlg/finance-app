import Resource from './resources';
import { Institution } from '../types';

/**
 * An Institution is an entity that Belvo can access information from.
 * It can be a bank (Banamex retail banking, HSBC corporate banking) or
 * fiscal type of institutions such as the "Servicio de Administración Tributaria" (SAT) in Mexico.
 *
 * @extends Resource
 */
class InstitutionResource extends Resource<Institution> {
  protected endpoint = 'api/institutions/';
}

export default InstitutionResource;
