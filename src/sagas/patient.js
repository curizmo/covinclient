import { all, call, takeLatest, select, put } from 'redux-saga/effects';

import {
  FETCH_PATIENT,
  ADD_BOOKING_REQUESTED,
  CHECK_PATIENT_APPOINTMENT,
  UPDATE_ENCOUNTER,
  clearPatient,
  setPatient,
  setIsEncounterUpdated,
} from '../actions/patient';
import { hideSpinner, showSpinner } from 'actions';
import { setErrorMessage } from '../actions/message';
import {
  createEncounter,
  fetchPatientEncountersByPractitionerUserId,
  fetchPatientIntakeData,
  postAddBooking,
  postCheckinStatus,
} from '../services/patient';
import {
  addPatientInOrganization,
  checkPatientInOrganization,
} from '../services/patientOrganization';
import { getOrganizationID } from '../selectors';
import {
  fetchPatientByNtoUserId,
  createPatient,
  fetchPatient,
  fetchPatientVitals,
} from '../services/patient';
import { postData } from '../services/api';
import { fetchPatientMedicationByPractitionerUserId } from 'services/patientMedication';

function* getPatientId(userData) {
  try {
    const response = yield call(fetchPatientByNtoUserId, userData.NTOUserID);
    return response.data && response.data.patientId;
  } catch (error) {
    return '';
  }
}

function* checkPatient(userData) {
  let patientId = yield call(getPatientId, userData);
  if (!patientId) {
    try {
      yield call(createPatient, userData);
      patientId = yield call(getPatientId, userData);
    } catch (error) {
      setErrorMessage({ header: 'Error', message: error });
    }
  }
  return patientId;
}

function* setPatientInOrganization(patientId, organizationID) {
  try {
    yield call(checkPatientInOrganization, patientId, organizationID);
  } catch (error) {
    yield call(addPatientInOrganization, patientId, organizationID);
  }
}

function* postBooking({ payload }) {
  const { bookingData, eventId, onBookingSuccess, userData, finishBooking } =
    payload;
  const patientID = yield call(checkPatient, {
    ...userData,
    PractitionerId: bookingData.practitionerId,
  });

  if (!patientID) {
    yield put(
      setErrorMessage({ header: 'Error', message: 'There is no such patient' }),
    );
  } else {
    const organizationID = yield select(getOrganizationID);
    yield call(setPatientInOrganization, patientID, organizationID);
    yield call(postData, postAddBooking, onBookingSuccess, {
      eventData: { ...bookingData, patientID },
      eventId,
      organizationID,
    });
  }
  yield call(finishBooking);
}

function* postCheck({ payload }) {
  const { authId, bookingId, redirectToLobby } = payload;
  yield call(postData, postCheckinStatus, redirectToLobby, {
    authId,
    bookingId,
  });
}

function* fetchPatientByPatientId({ payload: { patientId, ntoUserId } }) {
  try {
    yield put(showSpinner());
    const [patient, vitals, encounters, prescriptions, intakeData] = yield all([
      call(fetchPatient, patientId),
      call(fetchPatientVitals, patientId),
      call(fetchPatientEncountersByPractitionerUserId, patientId, ntoUserId),
      call(fetchPatientMedicationByPractitionerUserId, patientId, ntoUserId),
      call(fetchPatientIntakeData, patientId),
    ]);
    yield put(
      setPatient({
        ...patient.data,
        ...vitals.data,
        ...intakeData.data,
        pastNotes: encounters.data,
        pastPrescriptions: prescriptions?.data?.prescriptions,
      }),
    );
  } catch (error) {
    console.error(error);
  } finally {
    yield put(hideSpinner());
  }
}

function* updatePatientEncounter({
  payload: { patientId, riskLevel, prescriptionList, note, labs },
}) {
  try {
    yield put(showSpinner());
    yield call(
      createEncounter,
      { riskLevel, prescriptionList, note, labs },
      patientId,
    );
    yield put(setIsEncounterUpdated());
    yield put(clearPatient());
  } catch (error) {
    console.error(error);
  } finally {
    yield put(hideSpinner());
  }
}

function* watchPatient() {
  yield all([
    takeLatest(ADD_BOOKING_REQUESTED, postBooking),
    takeLatest(CHECK_PATIENT_APPOINTMENT, postCheck),
    takeLatest(FETCH_PATIENT, fetchPatientByPatientId),
    takeLatest(UPDATE_ENCOUNTER, updatePatientEncounter),
  ]);
}

export { watchPatient };
