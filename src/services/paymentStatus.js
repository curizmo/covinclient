import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function getPaymentStatuses() {
  return BEApi.get('/payment-status');
}
