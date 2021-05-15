export const SET_ORGANIZATION = 'SET_ORGANIZATION';
export const SET_ORGANIZATION_EVENTS = 'SET_ORGANIZATION_EVENTS';
export const SET_ORGANIZATION_BOOKINGS = 'SET_ORGANIZATION_BOOKINGS';

export const ORGANIZATION_REQUESTED = 'ORGANIZATION_REQUESTED';
export const ORGANIZATION_EVENTS_REQUESTED = 'ORGANIZATION_EVENTS_REQUESTED';
export const ORGANIZATION_BOOKINGS_REQUESTED =
  'ORGANIZATION_BOOKINGS_REQUESTED';

/**
 * @typedef {object} OrganizationEvent
 * @property {string} organizationID
 * @property {string} organizationName
 */

/**
 * @typedef {object} OrganizationBooking
 * @property {string} organizationID
 * @property {string} organizationName
 */

/**
 * @typedef {object} SelectedOrganization
 * @property {Organization} data
 * @property {OrganizationEvent[]} events
 * @property {OrganizationBooking[]} bookings
 */

/**
 * @param {Organization[]} payload
 * @return {{payload: Organization[], type: string}}
 */
export const setOrganization = (payload) => ({
  type: SET_ORGANIZATION,
  payload,
});

/**
 * @param {Organization[]} payload
 * @return {{payload: Organization[], type: string}}
 */
export const setOrganizationEvents = (payload) => ({
  type: SET_ORGANIZATION_EVENTS,
  payload,
});

/**
 * @param {Organization[]} payload
 * @return {{payload: Organization[], type: string}}
 */
export const setOrganizationBookings = (payload) => ({
  type: SET_ORGANIZATION_BOOKINGS,
  payload,
});

export const requestOrganization = (payload) => ({
  type: ORGANIZATION_REQUESTED,
  payload,
});

export const requestOrganizationEvents = (payload) => ({
  type: ORGANIZATION_EVENTS_REQUESTED,
  payload,
});

export const requestOrganizationBookings = () => ({
  type: ORGANIZATION_BOOKINGS_REQUESTED,
});
