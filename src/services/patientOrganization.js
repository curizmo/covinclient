import { BEApi } from './api';

/**
 * Create new patient organization mapping.
 *
 * @param {string} patientId
 * @param {string} organizationId
 *
 * @returns {Promise<object>}
 */
export async function checkPatientInOrganization(patientId, organizationId) {
  return BEApi.get(
    `/patient-organization/${patientId}/organization/${organizationId}`,
  );
}

/**
 * @param {string} patientId
 * @param {string} organizationId
 *
 * @returns {Promise<object>}
 */
export async function addPatientInOrganization(patientId, organizationId) {
  return BEApi.post('/patient-organization', { patientId, organizationId });
}

/**
 * @param {string} patientId
 * @param {string} organizationId
 *
 * @returns {Promise<object>}
 */
export async function addPatientToPractitionerOrganization(patientId) {
  return BEApi.post(`/patient-organization/patient/${patientId}`, {
    patientId,
  });
}
