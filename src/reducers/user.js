import { SET_USER, SET_USER_APPOINTMENTS, CLEAR_USER } from '../actions/user';

const initialState = {
  data: {},
  appointments: [],
};

const user = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return { ...state, data: payload };
    case SET_USER_APPOINTMENTS:
      return { ...state, appointments: payload };
    case CLEAR_USER:
      return { ...initialState };
    default:
      return state;
  }
};

export { user };
