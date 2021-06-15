import { api, BEApi } from './api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAppointmentDate } from 'utils/dateTime';

/**
 * @param {string} organizationID
 * @param {string} eventId
 * @param {object} eventData
 * @param {CancelToken} cancelToken
 * @returns {Promise<object>}
 */
export async function postAddBooking({
  organizationID,
  eventId,
  eventData,
  cancelToken,
}) {
  try {
    const { data } = await api.post(
      `/organization/${organizationID}/event/${eventId}/addbooking`,
      eventData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken,
      },
    );
    return data;
  } catch (error) {
    return { error };
  }
}

export async function postCheckinStatus({ authId, bookingId, cancelToken }) {
  try {
    const { data } = await api.post(
      `/user/${authId}/appointments/${bookingId}/checkin`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken,
      },
    );
    return data;
  } catch (error) {
    return { error };
  }
}

/**
 * Fetch all patients with pagination, search and sort field as query params.
 *
 * @returns {Promise<object>}
 */
export async function fetchPatients({
  offset,
  rowsCount,
  searchText,
  sortField,
  riskLevel,
}) {
  const pageQuery = rowsCount ? `offset=${offset}&rowsCount=${rowsCount}` : '';
  const searchQuery = searchText ? `&searchText=${searchText}` : '';
  const sortQuery = sortField?.colName
    ? `&colName=${sortField?.colName}&sortOrder=${sortField?.sortOrder}`
    : '';
  const risk = riskLevel ? `&riskStatus=${riskLevel}` : '';
  const query = `?${pageQuery}${searchQuery}${sortQuery}${risk}`;

  return BEApi.get(`/patients/${query}`);
}

/**
 * Fetch patient by id.
 *
 * @param {string} patientId
 *
 * @returns {Promise<object>}
 */
export async function fetchPatient(patientId) {
  return BEApi.get(`/patients/${patientId}`);
}

/**
 * Fetch patient vitals by patient id.
 *
 * @param {string} patientId
 *
 * @returns {Promise<object>}
 */
export async function fetchPatientVitals(patientId) {
  return BEApi.get(`/patients/${patientId}/vitals`);
}

export async function fetchPatientRiskData() {
  return BEApi.get('/patients/risk-status/count');
}

/**
 * @returns {Promise<object>}
 */
async function getPatientProfile(authId) {
  const { data } = await api.get(`/patient/${authId}`);
  return {
    ...data,
    dateOfBirth: data.dateOfBirth
      ? getAppointmentDate(data.dateOfBirth, 'yyyy-mm-dd')
      : null,
  };
}

export const usePatientProfile = (authId) => {
  return useQuery(['patientProfile', authId], () => getPatientProfile(authId));
};

export function useSaveProfile() {
  const q = useQueryClient();
  return useMutation((profile) => api.post('/patient/saveprofile', profile), {
    onSettled: (data, error, variables) => {
      q.refetchQueries('patientProfile', variables.authID);
    },
  });
}

/**
 * Create new patient.
 *
 * @param {object} patient
 *
 * @returns {Promise<object>}
 */
export async function createPatient(patient) {
  return BEApi.put('/patients', patient);
}

export async function updatePatient(id, patient) {
  return BEApi.put(`/patients/${id}`, patient);
}
/**
 * Update patient risk status.
 *
 * @param {string} id
 * @param {string} status
 *
 * @returns {Promise<object>}
 */
export async function updatePatientRiskStatus(id, status) {
  return BEApi.put(`/patients/${id}/patient-risk-status`, status);
}

/**
 * Create new encounter.
 *
 * @param {object} encounter
 *
 * @returns {Promise<object>}
 */
export async function createEncounter(encounter, patientId) {
  const { files = [], ...rest } = encounter;

  const form = new FormData();

  Object.keys(rest).forEach((key) => {
    form.append(key, encounter[key]);
  });

  files.forEach((file) => {
    form.append('files', file);
  });

  return BEApi.post(`/patients/${patientId}/encounter`, form);
}

/**
 * Fetch patient encounters.
 *
 * @param {string} patientId
 *
 * @returns {Promise<object>}
 */
export async function fetchPatientEncounters(patientId) {
  return BEApi.get(`/patients/${patientId}/encounter`);
}

/**
 * Fetch patient encounters.
 *
 * @returns {Promise<object>}
 */
export async function fetchUserEncounters() {
  return BEApi.get('/patients/encounters');
}

/**
 * Fetch patient encounters.
 *
 * @param {string} patientId
 *
 * @returns {Promise<object>}
 */
export async function fetchPatientEncountersByPractitionerUserId(
  patientId,
  userId,
) {
  return BEApi.get(
    `/patients/${patientId}/practitioner-user/${userId}/encounter`,
  );
}

/**
 * Fetch all patients.
 *
 * @param {string} ntoUserId
 *
 * @returns {Promise<object>}
 */
export async function fetchPatientByNtoUserId(ntoUserId) {
  return BEApi.get(`/patients/ntoUserId/${ntoUserId}`);
}

/**
 * Fetch patient event credit.
 *
 * @param {string} patientId
 *
 * @returns {Promise<object>}
 */
export async function fetchPatientEventCredit(organizationEventId) {
  return BEApi.get(
    `/patients/organization-event/${organizationEventId}/patient-event-credit`,
  );
}

/**
 * Search patients.
 *
 * @param {string} patientId
 *
 * @returns {Promise<object>}
 */
export async function searchPatients(search) {
  return BEApi.get(`/patients/search/?search=${search}`);
}

/**
 * @returns {Promise<object>}
 */
export function createCallBooking(data) {
  return BEApi.post('/appointment/create-call-booking', data);
}

/**
 * @returns {Promise<object>}
 */
export function fetchPatientIntakeData(patentId) {
  return BEApi.get(`/patient-intake-form/data/${patentId}`);
}
