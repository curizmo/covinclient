export const SET_ORGANIZATIONS = 'SET_ORGANIZATIONS';
export const ORGANIZATIONS_REQUESTED = 'ORGANIZATIONS_REQUESTED';

export const SET_SELECTED_ORGANIZATION = 'SET_SELECTED_ORGANIZATION';

/**
 * @typedef {object} Organization
 * @property {uid} organizationID
 * @property {string} organizationName
 * @property {string} address1
 * @property {string|null} address2
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {string|null} timeStamp
 * @property {Date} createdDate
 * @property {string} createdBy
 * @property {Date} lastModifiedDate
 * @property {string} lastModifiedBy
 */

/**
 * @param {Organization[]} payload
 * @return {{payload: Organization[], type: string}}
 */
export const setOrganizations = (payload) => ({
  type: SET_ORGANIZATIONS,
  payload,
});

export const requestOrganizations = () => ({
  type: ORGANIZATIONS_REQUESTED,
});

/**
 * @param {uid} payload
 * @return {{payload: uid, type: string}}
 */
export const setSelectedOrganization = (payload) => ({
  type: SET_SELECTED_ORGANIZATION,
  payload,
});
