import { all, call, takeLatest } from 'redux-saga/effects';

import { USER_REQUESTED, setUser } from '../actions/user';
import { getUser } from '../services/user';
import { fetchData } from '../services/api';

function* fetchUser({ payload: authId }) {
  yield call(fetchData, getUser, setUser, { authId });
}

function* watchUser() {
  yield all([takeLatest(USER_REQUESTED, fetchUser)]);
}

export { watchUser };
