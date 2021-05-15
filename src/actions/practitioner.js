export const SET_PRACTITIONERS = 'SET_PRACTITIONERS';
export const CLEAR_PRACTITIONERS = 'CLEAR_PRACTITIONERS';

export const PRACTITIONERS_REQUESTED = 'PRACTITIONERS_REQUESTED';

/**
 * @typedef {object} Practitioner
 * @property {string} practitionerId
 * @property {string} firstName
 * @property {string} lastName
 */

/**
 * @param {Practitioner[]} payload
 * @return {{payload: Practitioner[], type: string}}
 */
export const setPractitioners = (payload) => ({
  type: SET_PRACTITIONERS,
  payload,
});

export const clearPractitioners = () => ({
  type: CLEAR_PRACTITIONERS,
});

export const requestPractitioners = (payload) => ({
  type: PRACTITIONERS_REQUESTED,
  payload,
});
