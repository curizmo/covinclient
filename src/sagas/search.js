import { all, call, select, takeLatest, delay, put } from 'redux-saga/effects';

import {
  SEARCH_REQUESTED,
  setSearchResult,
  showSearchSpinner,
  hideSearchSpinner,
} from '../actions/search';
import { fetchPatientsWithVitals } from '../services/practitioner';
import { fetchData } from '../services/api';
import { getSearchText } from '../selectors';

function* makeSearch() {
  yield put(showSearchSpinner());
  const searchText = yield select(getSearchText);
  yield delay(500);
  yield call(fetchData, fetchPatientsWithVitals, setSearchResult, {
    searchText,
  });
  yield put(hideSearchSpinner());
}

function* watchSearch() {
  yield all([takeLatest(SEARCH_REQUESTED, makeSearch)]);
}

export { watchSearch };
