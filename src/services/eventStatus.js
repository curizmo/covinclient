import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function getEventStatuses() {
  return BEApi.get('/event-status');
}
