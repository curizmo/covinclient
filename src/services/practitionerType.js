import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function getPractitionerTypes() {
  return BEApi.get('/practitioner-type');
}
