import { all, call, takeLatest, put } from 'redux-saga/effects';

import {
  PRACTITIONERS_REQUESTED,
  setPractitioners,
  clearPractitioners,
} from '../actions/practitioner';
import { getPractitionersBySubdomain } from '../services/practitioner';

import { fetchData } from '../services/api';

function* fetchPractitioners({ payload: subdomain }) {
  yield put(clearPractitioners());
  yield call(
    fetchData,
    getPractitionersBySubdomain,
    ({ data }) => setPractitioners(data),
    {
      subdomain,
    },
  );
}

function* watchPractitioner() {
  yield all([takeLatest(PRACTITIONERS_REQUESTED, fetchPractitioners)]);
}

export { watchPractitioner };
