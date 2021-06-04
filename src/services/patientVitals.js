import { api } from './api';

export async function getPatientVitals(practitionerId) {
  return api.get(`/Practitioner/${practitionerId}/vitals`);
}

export async function getIndividualPatientVitals(practitionerId, patientId) {
  return api.get(`/Practitioner/${practitionerId}/patient/${patientId}/vitals`);
}
