import { all } from 'redux-saga/effects';
import { watchOrganizations } from './organizations';
import { watchOrganization } from './organization';
import { watchPatient } from './patient';
import { watchUser } from './user';
import { watchLobby } from './lobby';
import { watchPractitioner } from './practitioner';
import { watchAppointments } from './appointments';
import { watchSearch } from './search';

export function* rootSaga() {
  yield all([
    watchOrganizations(),
    watchOrganization(),
    watchPatient(),
    watchUser(),
    watchLobby(),
    watchPractitioner(),
    watchAppointments(),
    watchSearch(),
  ]);
}
