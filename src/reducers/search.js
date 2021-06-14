import {
  SET_SEARCH_TEXT,
  SET_SEARCH_RESULT,
  CLEAR_SEARCH,
} from '../actions/search';

/**
 * @returns {Search}
 */
export const initialState = {
  isShowSpinner: false,
  text: '',
  result: [],
  hasNext: true,
};

/**
 * @param {Search} state
 * @param {string} type - action type
 * @returns {Search}
 */
const search = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SEARCH_RESULT:
      return {
        ...state,
        result: payload?.patients,
        hasNext: payload?.hasNext,
      };
    case SET_SEARCH_TEXT:
      return {
        ...state,
        text: payload,
        result: [],
        hasNext: false,
      };
    case CLEAR_SEARCH:
      return { ...initialState };
    default:
      return state;
  }
};

export { search };
