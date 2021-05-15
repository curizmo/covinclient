import { all, call, takeLatest, select } from 'redux-saga/effects';

import {
  ORGANIZATION_REQUESTED,
  ORGANIZATION_EVENTS_REQUESTED,
  ORGANIZATION_BOOKINGS_REQUESTED,
  setOrganization,
  setOrganizationEvents,
  setOrganizationBookings,
} from '../actions/organization';
import {
  getOrganization,
  getOrganizationEvents,
  getOrganizationBookings,
} from '../services/organization';
import { getOrganizationSubdomain } from '../selectors';
import { fetchData } from '../services/api';

function* fetchOrganization({ payload: subdomain }) {
  yield call(fetchData, getOrganization, setOrganization, { subdomain });
}

function* fetchOrganizationEvents({ payload: subdomain }) {
  yield call(fetchData, getOrganizationEvents, setOrganizationEvents, {
    subdomain,
  });
}

function* fetchOrganizationBookings() {
  const subdomain = yield select(getOrganizationSubdomain);
  yield call(fetchData, getOrganizationBookings, setOrganizationBookings, {
    subdomain,
  });
}

function* watchOrganization() {
  yield all([
    takeLatest(ORGANIZATION_REQUESTED, fetchOrganization),
    takeLatest(ORGANIZATION_EVENTS_REQUESTED, fetchOrganizationEvents),
    takeLatest(ORGANIZATION_BOOKINGS_REQUESTED, fetchOrganizationBookings),
  ]);
}

export { watchOrganization };
