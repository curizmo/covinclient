import { SET_USER, SET_USER_APPOINTMENTS } from '../actions/user';

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
    default:
      return state;
  }
};

export { user };
