import { START_LOGIN, END_LOGIN } from '../actions/login';

const initialState = {
  isInProgress: false,
};

const login = (state = initialState, { type }) => {
  switch (type) {
    case START_LOGIN:
      return { isInProgress: true };
    case END_LOGIN:
      return { isInProgress: false };
    default:
      return state;
  }
};

export { login };
