import { api, BEApi } from './api';

/**
 * @param {string} organizationID
 * @param {CancelToken} cancelToken
 * @returns {Promise<object>}
 */
export async function getOrganization({ subdomain, cancelToken }) {
  const { data } = await api.get(`/organization/${subdomain}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    cancelToken,
  });
  return data[0];
}

/**
 * @param {string} organizationID
 * @param {CancelToken} cancelToken
 * @returns {Promise<object>}
 */
export async function getOrganizationEvents({ subdomain, cancelToken }) {
  const { data } = await BEApi.get(
    `/organization-events/subdomain/${subdomain}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      cancelToken,
    },
  );

  return data.organizationEvents;
}

/**
 * @param {string} subdomain
 * @param {string} eventId
 * @param {CancelToken} cancelToken
 * @returns {Promise<object>}
 */
export async function getOrganizationEvent({
  subdomain,
  eventId,
  cancelToken,
}) {
  const { data } = await api.get(
    `/organization/${subdomain}/event/${eventId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      cancelToken,
    },
  );
  return data;
}

/**
 * @param {string} subdomain
 * @param {string} eventId
 * @param {CancelToken} cancelToken
 * @returns {Promise<object>}
 */
export async function getOrganizationBookings({
  subdomain,
  eventId,
  cancelToken,
}) {
  try {
    const { data } = await api.get(
      `/organization/${subdomain}/event/${eventId}/bookings`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken,
      },
    );
    return data;
  } catch (error) {
    return { error };
  }
}

/**
 * @param {string} organizationName
 * @returns {Promise<object>}
 */
export async function getOrganizationByOrganizationName(organizationName) {
  return BEApi.get(`/organization/organizationName/${organizationName}`);
}

/**
 * @param {string} subdomain
 * @returns {Promise<object>}
 */
export async function getOrganizationBySubdomain(subdomain) {
  return BEApi.get(`/organization/subdomain/${subdomain}`);
}

/**
 * @param {string} subdomain
 * @returns {Promise<object>}
 */
export async function getOrganizationById(organizationId) {
  return BEApi.get(`/organization/${organizationId}`);
}

/**
 * @param {string} subdomain
 * @returns {Promise<object>}
 */
export async function getAvailableAppointmentsDateTime({
  subdomain,
  practitionerId,
  eventId,
  date,
}) {
  return BEApi.get(
    `/organization/${subdomain}/event/${eventId}/practitioner/${practitionerId}/eventDate/${date}`,
  );
}
