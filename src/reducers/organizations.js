import { SET_ORGANIZATIONS } from '../actions/organizations';

/**
 * @returns {Organization[]}
 */
export const initialState = [];

/**
 * @param {Organization[]} state
 * @param {string} type - action type
 * @param {Organization[]} [payload]
 * @returns {Organization[]}
 */
const organizations = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ORGANIZATIONS:
      return payload;
    default:
      return state;
  }
};

export { organizations };
