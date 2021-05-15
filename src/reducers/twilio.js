import {
  SET_TWILIO_DEVICE,
  SET_TWILIO_CONNECTION,
  RESET_TWILIO,
} from '../actions/twilio';

export const initialState = {
  device: {},
  connection: {},
};

const twilio = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_TWILIO_DEVICE:
      return {
        ...state,
        device: payload,
      };
    case SET_TWILIO_CONNECTION:
      return {
        ...state,
        connection: payload,
      };
    case RESET_TWILIO:
      return initialState;
    default:
      return state;
  }
};

export { twilio };
