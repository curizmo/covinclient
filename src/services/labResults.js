import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function uploadLabResult(patientId, appointmentId, labResults) {
  const formData = new FormData();

  labResults.forEach((labResult) => {
    formData.append('labImages', labResult);
  });
  formData.append('form', JSON.stringify({}));

  return BEApi.put(
    `/patient-labs/lab/${patientId}/appointment/${appointmentId}`,
    formData,
  );
}

/**
 * @returns {Promise<object>}
 */
export function deleteLabResult(appointmentId, labResults) {
  return BEApi.put(
    `/patient-labs/lab/appointment/${appointmentId}/delete`,
    labResults,
  );
}
