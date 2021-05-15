import { BEApi } from './api';

/**
 * @param {string} bookingId
 * @returns {Promise<object>}
 */
export function subscribeChannelById(bookingId, dateToday) {
  return BEApi.post(`/lobby/subscribe-channel/${bookingId}`, {
    dateToday,
  });
}

/**
 * @returns {Promise<object>}
 */
export function getCheckedInBooking() {
  return BEApi.get('/lobby/get-checkedin');
}

/**
 * @returns {Promise<object>}
 */
export function addProductToLobby(productId, organizationId) {
  return BEApi.post(
    `/lobby/organization/${organizationId}/products/${productId}`,
    {},
  );
}

/**
 * @returns {Promise<object>}
 */
export function deleteProductFromLobby(productId, organizationId) {
  return BEApi.delete(
    `/lobby/organization/${organizationId}/products/${productId}`,
  );
}

/**
 * @returns {Promise<object>}
 */
export function getLobbyProducts(organizationId) {
  return BEApi.get(`/lobby/organization/${organizationId}/products`);
}
