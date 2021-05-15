import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function getOrganizationTypes() {
  return BEApi.get('/organization-type');
}
