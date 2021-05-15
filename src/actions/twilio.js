export const SET_TWILIO_DEVICE = 'SET_TWILIO_DEVICE';
export const SET_TWILIO_CONNECTION = 'SET_TWILIO_CONNECTION';
export const RESET_TWILIO = 'RESET_TWILIO';

export const setTwilioDevice = (payload) => ({
  type: SET_TWILIO_DEVICE,
  payload,
});

export const setTwilioConnection = (payload) => ({
  type: SET_TWILIO_CONNECTION,
  payload,
});

export const resetTwilio = () => ({
  type: RESET_TWILIO,
});
