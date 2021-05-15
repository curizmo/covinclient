import { all, call, takeLatest } from 'redux-saga/effects';

import {
  ORGANIZATIONS_REQUESTED,
  setOrganizations,
} from '../actions/organizations';
import { getOrganizations } from '../services/organizations';
import { fetchData } from '../services/api';

function* fetchOrganizations() {
  yield call(fetchData, getOrganizations, setOrganizations);
}

function* watchOrganizations() {
  yield all([takeLatest(ORGANIZATIONS_REQUESTED, fetchOrganizations)]);
}

export { watchOrganizations };
