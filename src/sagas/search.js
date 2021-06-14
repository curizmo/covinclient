import { all, call, takeLatest, delay, put } from 'redux-saga/effects';

import {
  SEARCH_REQUESTED,
  setSearchResult,
  setSearchText,
  hideCustomSpinner,
  showCustomSpinner,
  clearSearch,
} from '../actions';
import { fetchPatientsWithVitals } from '../services/practitioner';
import { fetchData } from '../services/api';

function* makeSearch({ payload }) {
  try {
    yield delay(1000);
    yield put(showCustomSpinner(payload.spinner));
    yield put(setSearchText(payload.searchText));
    yield call(fetchData, fetchPatientsWithVitals, setSearchResult, {
      searchText: payload.searchText,
      selectedCases: payload.selectedCases,
      page: payload.page,
    });
  } catch (err) {
    yield put(clearSearch());
  } finally {
    yield put(hideCustomSpinner());
  }
}

function* watchSearch() {
  yield all([takeLatest(SEARCH_REQUESTED, makeSearch)]);
}

export { watchSearch };
