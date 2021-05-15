import { dotnetapi, api } from './api';

/**
 * Fetch Clinical Impression By Encounter Id.
 *
 * @returns {Promise<object>}
 */
export async function fetchPatientSyncData(request) {
  return dotnetapi.post('/encounter/patientsyncdata', request);
}

/**
 * Set Share In App for Encounter.
 *
 * @returns {Promise<object>}
 */
export async function setShareInAppFlag(request) {
  return api.post('/patientencounter/setshareinapp', request);
}
