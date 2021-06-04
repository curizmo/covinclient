export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_RESULT = 'SET_SEARCH_RESULT';
export const SEARCH_REQUESTED = 'SEARCH_REQUESTED';
export const SHOW_SEARCH_SPINNER = 'SHOW_SEARCH_SPINNER';
export const HIDE_SEARCH_SPINNER = 'HIDE_SEARCH_SPINNER';

export const setSearchText = (payload) => ({
  type: SET_SEARCH_TEXT,
  payload,
});

export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

export const setSearchResult = (payload) => ({
  type: SET_SEARCH_RESULT,
  payload,
});

export const requestSearch = () => ({
  type: SEARCH_REQUESTED,
});

export const showSearchSpinner = () => ({
  type: SHOW_SEARCH_SPINNER,
});

export const hideSearchSpinner = () => ({
  type: HIDE_SEARCH_SPINNER,
});
