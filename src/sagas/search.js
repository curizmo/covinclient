import { all, call, takeLatest, delay, put } from 'redux-saga/effects';

import {
  SEARCH_REQUESTED,
  setSearchResult,
  setSearchText,
  hideCustomSpinner,
} from '../actions';
import { fetchPatientsWithVitals } from '../services/practitioner';
import { fetchData } from '../services/api';

function* makeSearch({ payload }) {
  yield delay(1000);
  yield put(setSearchText(payload.searchText));
  yield call(fetchData, fetchPatientsWithVitals, setSearchResult, {
    searchText: payload.searchText,
    selectedCases: payload.selectedCases,
    page: payload.page,
  });
  yield put(hideCustomSpinner());
}

function* watchSearch() {
  yield all([takeLatest(SEARCH_REQUESTED, makeSearch)]);
}

export { watchSearch };
