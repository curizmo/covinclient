import { BEApi } from './api';

export const fetchPatientSymptoms = async (patientId) => {
  return BEApi.get(`/symptoms/patient/${patientId}`);
};
