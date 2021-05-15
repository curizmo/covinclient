import {
  SET_PATIENT,
  CLEAR_PATIENT,
  SET_IS_ENCOUNTER_UPDATED,
} from '../actions';

/**
 * @returns {Patient{}}
 */
export const initialState = {
  patientId: null,
  ntoUserId: null,
  givenName: '',
  familyName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  timestamp: {},
  createdDate: '',
  createdBy: '',
  lastModifiedDate: '',
  lastModifiedBy: '',
  fhirId: '',
  gender: '',
  dateOfBirth: null,
  insuranceProvider: null,
  insuranceId: null,
  patientHealthNumber: null,
  countryCode: '',
  status: null,
  vitals: null,
  isEncounterUpdated: false,
};

/**
 * @param {Patient{}} state
 * @param {string} type - action type
 * @returns {Patient{}}
 */
const patient = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_PATIENT:
      return {
        ...payload,
      };
    case SET_IS_ENCOUNTER_UPDATED:
      return {
        ...state,
        isEncounterUpdated: true,
      };
    case CLEAR_PATIENT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export { patient };
