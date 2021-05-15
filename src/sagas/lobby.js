import { all, call, takeLatest } from 'redux-saga/effects';

import { GET_CHECKED_IN_BOOKING, setAppointment } from '../actions/appointment';
import { getCheckedInBooking } from '../services/lobby';
import { fetchData } from '../services/api';

const setAppointmentData = (response) => {
  return setAppointment(response.data);
};

function* fetchCheckedInBooking({ payload: gotoLobby }) {
  yield call(fetchData, getCheckedInBooking, setAppointmentData, null, () =>
    setAppointment([]),
  );
  gotoLobby();
}

function* watchLobby() {
  yield all([takeLatest(GET_CHECKED_IN_BOOKING, fetchCheckedInBooking)]);
}

export { watchLobby };
