export const SET_APPOINTMENT = 'SET_APPOINTMENT';
export const SET_APPOINTMENT_STATUS = 'SET_APPOINTMENT_STATUS';
export const GET_CHECKED_IN_BOOKING = 'GET_CHECKED_IN_BOOKING';

export const setAppointment = (payload) => ({
  type: SET_APPOINTMENT,
  payload,
});

export const setAppointmentStatus = (payload) => ({
  type: SET_APPOINTMENT_STATUS,
  payload,
});

export const getCheckedInBooking = (payload) => ({
  type: GET_CHECKED_IN_BOOKING,
  payload,
});
