import { BEApi } from './api';

export async function fetchPatientMedicationByPractitionerUserId(
  patientId,
  ntoUserId,
) {
  return BEApi.get(
    `/patient-medication/${patientId}/practitioner-user/${ntoUserId}/`,
  );
}

export async function createPatientMedication(payload, appointmentId) {
  return BEApi.post(
    `/patient-medication/appointment/${appointmentId}`,
    payload,
  );
}

export async function updatePatientMedication(
  payload,
  medicationId,
  appointmentId,
) {
  return BEApi.put(
    `/patient-medication/appointment/${appointmentId}/medication/${medicationId}`,
    payload,
  );
}

export async function deletePatientMedication(medicationId, appointmentId) {
  return BEApi.delete(
    `/patient-medication/appointment/${appointmentId}/medication/${medicationId}`,
  );
}
