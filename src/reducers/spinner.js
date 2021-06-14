import {
  SHOW_SPINNER,
  HIDE_SPINNER,
  SHOW_CUSTOM_SPINNER,
  HIDE_CUSTOM_SPINNER,
} from '../actions/spinner';
import { SPINNERS } from '../constants';

/**
 * @returns {Spinner}
 */
export const initialState = {
  isShow: false,
  custom: SPINNERS.MAIN,
};

/**
 * @param {Spinner} state
 * @param {string} type - action type
 * @returns {Spinner}
 */
const spinner = (state = initialState, { type, payload }) => {
  switch (type) {
    case SHOW_SPINNER:
      return {
        ...state,
        isShow: true,
      };
    case HIDE_SPINNER:
      return {
        ...state,
        isShow: false,
      };
    case SHOW_CUSTOM_SPINNER:
      return {
        ...state,
        custom: payload || SPINNERS.MAIN,
      };
    case HIDE_CUSTOM_SPINNER:
      return {
        ...state,
        custom: SPINNERS.NONE,
      };
    default:
      return state;
  }
};

export { spinner };
