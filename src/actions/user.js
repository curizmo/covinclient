export const SET_USER = 'SET_USER';
export const USER_REQUESTED = 'USER_REQUESTED';
export const SET_USER_APPOINTMENTS = 'SET_USER_APPOINTMENTS';

export const setUser = (payload) => ({
  type: SET_USER,
  payload,
});

export const requestUser = (payload) => ({
  type: USER_REQUESTED,
  payload,
});

export const setUserAppointments = (payload) => ({
  type: SET_USER_APPOINTMENTS,
  payload,
});
