import {
  SET_APPOINTMENT,
  SET_APPOINTMENT_STATUS,
} from '../actions/appointment';

/**
 * @returns {Appointment}
 */
export const initialState = {
  organizationEventBookingId: '',
  status: '',
};

/**
 * @param {Appointment} state
 * @param {string} type - action type
 * @returns {Appointment}
 */
const appointment = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_APPOINTMENT:
      return {
        ...payload,
        organizationEventBookingId: payload.organizationEventBookingId,
      };
    case SET_APPOINTMENT_STATUS:
      return {
        ...state,
        status: payload,
      };
    default:
      return state;
  }
};

export { appointment };
