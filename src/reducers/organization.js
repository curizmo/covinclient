import {
  SET_ORGANIZATION,
  SET_ORGANIZATION_EVENTS,
  SET_ORGANIZATION_BOOKINGS,
} from '../actions/organization';

/**
 * @returns {SelectedOrganization}
 */
export const initialState = {
  data: {},
  events: [],
  bookings: [],
};

/**
 * @param {Organization} state
 * @param {string} type - action type
 * @param {Organization[]} [payload]
 * @returns {Organization[]}
 */
const organization = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ORGANIZATION:
      return {
        ...state,
        data: payload || {},
      };
    case SET_ORGANIZATION_EVENTS:
      return {
        ...state,
        events: payload,
      };
    case SET_ORGANIZATION_BOOKINGS:
      return {
        ...state,
        bookings: payload,
      };
    default:
      return state;
  }
};

export { organization };
