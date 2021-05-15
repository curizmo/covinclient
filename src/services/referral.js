import { BEApi } from './api';

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function createReferral(payload) {
  return BEApi.post('/referral', payload);
}

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function updateReferralStatus(referralId, payload) {
  return BEApi.put(`/referral/${referralId}/status`, payload);
}
