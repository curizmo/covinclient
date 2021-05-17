import { BEApi } from './api';

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function getLabs() {
  return BEApi.get('/labs');
}
