import { BEApi } from './api';

export function createPatientTask(payload) {
  const { files, ...rest } = payload;

  const form = new FormData();

  Object.keys(rest).forEach((key) => {
    form.append(key, payload[key]);
  });

  files.forEach((file) => {
    form.append('files', file);
  });

  return BEApi.post('/patient-tasks', form);
}

export function getTasks(ntoUserId, date) {
  return BEApi.get(`/patient-tasks/ntouser/${ntoUserId}?date=${date}`);
}

export function updateTaskStatus(payload, taskId) {
  return BEApi.put(`/patient-tasks/${taskId}/status`, payload);
}

export function getPatientTasks(patientId) {
  return BEApi.get(`/patient-tasks/patient/${patientId}`);
}

export function updatePatientTask(payload, taskId) {
  const { newFiles, files, ...rest } = payload;

  const form = new FormData();

  Object.keys(rest).forEach((key) => {
    form.append(key, payload[key]);
  });

  newFiles.forEach((file) => {
    form.append('newFiles', file);
  });

  form.append('files', JSON.stringify(files));

  return BEApi.put(`/patient-tasks/${taskId}`, form);
}

export function deleteTask(taskId) {
  return BEApi.delete(`/patient-tasks/${taskId}`);
}
