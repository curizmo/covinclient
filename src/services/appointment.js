import queryString from 'query-string';

import { BEApi } from './api';

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function invitePatientToLobby(appointment) {
  return BEApi.post(
    '/exam-room/invite',
    { appointment },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function startAppoinment(payload) {
  return BEApi.post('/exam-room', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function sendChatMessage(payload) {
  return BEApi.post('/exam-room/chat-message', payload);
}

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function sendChatFile(file, user, appointment, fileType) {
  const form = new FormData();
  form.append('file', file);
  form.append('appointment', JSON.stringify(appointment));
  form.append('user', user);
  form.append('fileType', fileType);

  return BEApi.post('/exam-room/chat-message/file', form, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

export function uploadEncounterFiles(file, appointmentId, fileType) {
  const form = new FormData();

  form.append('file', file);
  form.append('fileType', fileType);

  return BEApi.post(`/appointment/${appointmentId}/file`, form, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
}

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function endAppointment(payload) {
  return BEApi.post('/exam-room/end', payload);
}

/**
 * Get all chat messages that belongs to an appointment.
 * @returns {Promise<object>}
 */
export function getChatMessages(appointmentId) {
  return BEApi.get(`/exam-room/chat-message/${appointmentId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * @param {string} appointmentId
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function createOrUpdateEncounter(appointmentId, payload) {
  return BEApi.put(`appointment/encounter/${appointmentId}`, payload);
}

/**
 * @param {string} appointmentId
 * @returns {Promise<object>}
 */
export function fetchAppointmentEncounters(appointmentId) {
  return BEApi.get(`appointment/encounter/${appointmentId}`);
}

/**
 * @param {string} appointmentId
 * @returns {Promise<object>}
 */
export function fetchAppointmentFiles(appointmentId) {
  return BEApi.get(`appointment/${appointmentId}/files`);
}

/**
 * @param {string} appointmentId
 * @returns {Promise<object>}
 */
export function deleteAppointmentFile(appointmentId, fileId) {
  return BEApi.delete(`appointment/${appointmentId}/file/${fileId}`);
}

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export function createAppointmentReview(payload) {
  return BEApi.post('/exam-room/review', payload);
}

/**
 * @param {string} appointments
 * @returns {Promise<object>}
 */
export function fetchAppointmentsEncounters(appointments) {
  const query = queryString.stringify(
    { appointmentId: appointments },
    { arrayFormat: 'comma' },
  );

  return BEApi.get(`appointment/encounters/?${query}`);
}

/**
 * @param {string} appointments
 * @returns {Promise<object>}
 */
export function fetchInProgressAppointment() {
  return BEApi.get('/appointment/in-progress');
}

/**
 * @param {string} appointmentId
 * @returns {Promise<object>}
 */
export function cancelAppointment(appointmentId) {
  return BEApi.put(`/appointment/${appointmentId}/cancel`);
}

/**
 * @param {string} appointmentId
 * @returns {Promise<object>}
 */
export function confirmAppointment(appointmentId) {
  return BEApi.put(`/appointment/${appointmentId}/confirm`);
}

/**
 * @param {string} note
 * @returns {Promise<object>}
 */
export function getDiagnosis(payload) {
  return BEApi.post('/appointment/encounter/diagnosis', payload);
}

/**
 * @param {string} note
 * @returns {Promise<object>}
 */
export function getMedicines(searchTerm) {
  return BEApi.get(`/appointment/encounter/medicines/?search=${searchTerm}`);
}

/**
 * @param {string} note
 * @returns {Promise<object>}
 */
export function getPrescriptions(payload) {
  return BEApi.post('/appointment/encounter/prescription', payload);
}
