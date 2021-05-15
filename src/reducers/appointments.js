import {
  SET_AVAILABLE_DATE_TIME,
  CLEAR_AVAILABLE_DATE_TIME,
} from '../actions/appointments';

/**
 * @returns {Appointments}
 */
export const initialState = {
  availableDateTime: {},
};

/**
 * @param {Appointments} state
 * @param {string} type - action type
 * @returns {Appointments}
 */
const appointments = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_AVAILABLE_DATE_TIME:
      return {
        ...state,
        availableDateTime: payload,
      };
    case CLEAR_AVAILABLE_DATE_TIME:
      return {
        ...state,
        availableDateTime: {},
      };
    default:
      return state;
  }
};

export { appointments };
