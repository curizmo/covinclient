import { BEApi } from './api';

export async function createPatientLab(payload, appointmentId) {
  return BEApi.post(`/patient-labs/appointment/${appointmentId}`, payload);
}

export async function deletePatientLab(labId, appointmentId) {
  return BEApi.delete(
    `/patient-labs/appointment/${appointmentId}/lab/${labId}`,
  );
}
