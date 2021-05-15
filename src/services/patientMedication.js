import { BEApi } from './api';

export async function fetchPatientMedicationByPractitionerUserId(
  patientId,
  ntoUserId,
) {
  return BEApi.get(
    `/patient-medication/${patientId}/practitioner-user/${ntoUserId}/`,
  );
}
