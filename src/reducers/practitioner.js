import {
  SET_PRACTITIONERS,
  CLEAR_PRACTITIONERS,
} from '../actions/practitioner';

/**
 * @typedef {object} Practitioners
 * @property {Practitioner[]} practitioners
 */

/**
 * @typedef {object} PractitionerState
 * @property {Practitioners} data
 */

/**
 * @returns {object}
 */
export const initialState = {
  data: {
    practitioners: [],
  },
};

/**
 * @param {PractitionerState} state
 * @param {string} type - action type
 * @param {Practitioners} payload
 * @returns {Practitioner[]}
 */
const practitioner = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_PRACTITIONERS:
      return {
        ...state,
        data: payload || {},
      };
    case CLEAR_PRACTITIONERS:
      return {
        ...state,
        data: {},
      };
    default:
      return state;
  }
};

export { practitioner };
