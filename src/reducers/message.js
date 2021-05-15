import {
  POST_FAILED,
  SET_ERROR,
  SET_SUCCESS,
  SET_WARNING,
  CLEAR_MESSAGE,
} from '../actions/message';
import { bannerTypes } from '../constants';

/**
 * @returns {Message}
 */
export const initialState = {
  type: undefined,
  header: '',
  message: '',
};

/**
 * @param {Message} state
 * @param {string} type - action type
 * @param {Message} [payload]
 * @returns {Message}
 */
const message = (state = initialState, { type, payload }) => {
  switch (type) {
    case POST_FAILED:
    case SET_ERROR:
      return {
        ...payload,
        type: bannerTypes.error,
      };
    case SET_SUCCESS:
      return {
        ...payload,
        type: bannerTypes.success,
      };
    case SET_WARNING:
      return {
        ...payload,
        type: bannerTypes.warning,
      };
    case CLEAR_MESSAGE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export { message };
