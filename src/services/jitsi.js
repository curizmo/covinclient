import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function fetchJWT() {
  return BEApi.get('/jitsi/jwt');
}
