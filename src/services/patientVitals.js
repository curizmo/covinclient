import { api } from './api';

export async function getPatientVitals(practitionerId) {
  return api.get(`/Practitioner/${practitionerId}/vitals`);
}
