export const POST_FAILED = 'POST_FAILED';

export const SET_ERROR = 'SET_ERROR';
export const SET_SUCCESS = 'SET_SUCCESS';
export const SET_WARNING = 'SET_WARNING';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

/**
 * @typedef {object} Message
 * @property {string} type - 'error' | 'success' | 'warning' | undefined
 * @property {string} header
 * @property {string} message
 */

/**
 * @param {Message} payload
 * @return {{payload: Message, type: string}}
 */
export const setPostFailedMessage = (payload) => ({
  type: POST_FAILED,
  payload,
});

/**
 * @param {Message} payload
 * @return {{payload: Message, type: string}}
 */
export const setErrorMessage = (payload) => ({
  type: SET_ERROR,
  payload,
});
/**
 * @param {Message} payload
 * @return {{payload: Message, type: string}}
 */
export const setSuccessMessage = (payload) => ({
  type: SET_SUCCESS,
  payload,
});

/**
 * @param {Message} payload
 * @return {{payload: Message, type: string}}
 */
export const setWarningMessage = (payload) => ({
  type: SET_WARNING,
  payload,
});

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});
