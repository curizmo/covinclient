import { all, call, put, takeLatest } from 'redux-saga/effects';

import {
  REQUEST_AVAILABLE_DATE_TIME,
  clearAvailableDateTime,
  setAvailableDateTime,
} from '../actions/appointments';
import { showSpinner, hideSpinner } from '../actions/spinner';
import { getAvailableAppointmentsDateTime } from '../services/organization';
import { fetchData } from '../services/api';

function* fetchAvailableDateTime({ payload }) {
  yield put(showSpinner());
  yield put(clearAvailableDateTime());
  yield call(
    fetchData,
    getAvailableAppointmentsDateTime,
    setAvailableDateTime,
    payload,
  );
  yield put(hideSpinner());
}

function* watchAppointments() {
  yield all([takeLatest(REQUEST_AVAILABLE_DATE_TIME, fetchAvailableDateTime)]);
}

export { watchAppointments };
