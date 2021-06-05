import { all, call, takeLatest, delay, put } from 'redux-saga/effects';

import {
  SEARCH_REQUESTED,
  setSearchResult,
  setSearchText,
  showSearchSpinner,
  hideSearchSpinner,
} from '../actions/search';
import { fetchPatientsWithVitals } from '../services/practitioner';
import { fetchData } from '../services/api';

function* makeSearch({ payload: searchText }) {
  console.log(searchText);
  yield put(showSearchSpinner());
  yield delay(500);
  yield put(setSearchText(searchText));
  yield call(fetchData, fetchPatientsWithVitals, setSearchResult, {
    searchText,
  });
  yield put(hideSearchSpinner());
}

function* watchSearch() {
  yield all([takeLatest(SEARCH_REQUESTED, makeSearch)]);
}

export { watchSearch };
