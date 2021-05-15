export const ADD_BOOKING_REQUESTED = 'ADD_BOOKING_REQUESTED';
export const CHECK_PATIENT_APPOINTMENT = 'CHECK_PATIENT_APPOINTMENT';
export const FETCH_PATIENT = 'FETCH_PATIENT';
export const SET_PATIENT = 'SET_PATIENT';
export const CLEAR_PATIENT = 'CLEAR_PATIENT';
export const UPDATE_ENCOUNTER = 'UPDATE_ENCOUNTER';
export const SET_IS_ENCOUNTER_UPDATED = 'SET_IS_ENCOUNTER_UPDATED';

/**
 * @typedef {object} BookingData
 * @property {string} organizationID
 * @property {string} organizationName
 * @property {string} organizationName
 */

/**
 * @typedef {object} OrganizationEvent
 * @property {string} organizationID
 * @property {string} eventID
 * @property {BookingData} bookingData
 */

/**
 * @param {Booking} payload
 * @return {{payload: Organization[], type: string}}
 */
export const addBooking = (payload) => ({
  type: ADD_BOOKING_REQUESTED,
  payload,
});

export const checkAppointment = (payload) => ({
  type: CHECK_PATIENT_APPOINTMENT,
  payload,
});

export const fetchPatient = (payload) => ({
  type: FETCH_PATIENT,
  payload,
});

export const setPatient = (payload) => ({
  type: SET_PATIENT,
  payload,
});

export const clearPatient = () => ({
  type: CLEAR_PATIENT,
});

export const updateEncounter = (payload) => ({
  type: UPDATE_ENCOUNTER,
  payload,
});

export const setIsEncounterUpdated = () => ({
  type: SET_IS_ENCOUNTER_UPDATED,
});
