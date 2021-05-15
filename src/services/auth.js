import { BEApi } from './api';

/**
 * @param {string} accessToken
 *
 * @returns {Promise<object>}
 */
export function login() {
  return BEApi.post('/auth', {});
}
