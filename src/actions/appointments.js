export const REQUEST_AVAILABLE_DATE_TIME = 'REQUEST_AVAILABLE_DATE_TIME';
export const SET_AVAILABLE_DATE_TIME = 'SET_AVAILABLE_DATE_TIME';
export const CLEAR_AVAILABLE_DATE_TIME = 'CLEAR_AVAILABLE_DATE_TIME';

export const requestAvailableDateTime = (payload) => ({
  type: REQUEST_AVAILABLE_DATE_TIME,
  payload,
});

export const setAvailableDateTime = (payload) => ({
  type: SET_AVAILABLE_DATE_TIME,
  payload,
});

export const clearAvailableDateTime = () => ({
  type: CLEAR_AVAILABLE_DATE_TIME,
});
