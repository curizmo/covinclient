import { BEApi } from './api';

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function getMedications() {
  return BEApi.get('/medication');
}
