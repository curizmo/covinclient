import { SHOW_SPINNER, HIDE_SPINNER } from '../actions/spinner';

/**
 * @returns {Spinner}
 */
export const initialState = {
  isShow: false,
};

/**
 * @param {Spinner} state
 * @param {string} type - action type
 * @returns {Spinner}
 */
const spinner = (state = initialState, { type }) => {
  switch (type) {
    case SHOW_SPINNER:
      return {
        isShow: true,
      };
    case HIDE_SPINNER:
      return {
        isShow: false,
      };
    default:
      return state;
  }
};

export { spinner };
