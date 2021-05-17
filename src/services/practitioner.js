import { BEApi, api } from './api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import camelcaseKeys from 'camelcase-keys';
import practitionersData from '../mocks/practitioners.json';
import { hideSpinner, showSpinner } from 'actions';

/**
 * @returns {Promise<object>}
 */
export function getPractitionersBySubdomain({ subdomain }) {
  return BEApi.get(`/practitioners/subdomain/${subdomain}`);
}

/**
 * @returns {Promise<object>}
 */
export function getPractitioner() {
  // @toDo replace mocks with real api
  return Promise.resolve(practitionersData[0]);
}

/**
 * @returns {Promise<object>}
 */
async function getPractitionerProfile(authId) {
  const { data } = await api.get(`/practitioner/${authId}`);
  return camelcaseKeys({
    ...data[0],
    dateOfBirth: data[0].dateOfBirth ? new Date(data[0].dateOfBirth) : null,
  });
}

export const usePractitionerProfile = (authId) => {
  return useQuery(['practitionerProfile', authId], () =>
    getPractitionerProfile(authId),
  );
};

export function useSaveProfile() {
  const q = useQueryClient();
  return useMutation(
    (profile, config) => api.post('/practitioner/saveprofile', profile, config),
    {
      onSettled: (data, error, variables) => {
        q.refetchQueries('practitionerProfile', variables.get('authId'));
      },
    },
  );
}

/**
 * Search for practitioner
 *
 * @returns {Promise<object>}
 */
export function searchPractitioner(search) {
  return BEApi.get(`/practitioners?name=${search}`);
}

/**
 * Register new practitioner
 *
 * @returns {Promise<object>}
 */
export function createPractitionerRegistration(payload) {
  const { identificationImages, ...rest } = payload;

  const form = new FormData();

  Object.keys(rest).forEach((key) => {
    form.append(key, payload[key]);
  });

  identificationImages.forEach((img) => {
    form.append('identificationImages', img);
  });

  return BEApi.post('/practitioners/register', form);
}

/**
 * @returns {Promise<object>}
 */
export function fetchReferrals() {
  return BEApi.get('/practitioners/referrals');
}

/**
 * @returns {Promise<object>}
 */
export function fetchPractitionerOrganizations(ntoUserId) {
  return BEApi.get(`/practitioners/ntouser/${ntoUserId}/organizations`);
}

/**
 * Fetch overviewdata on dashboard for the practitioner
 *
 * @authId {string} the auth ID
 * @date {string} date value, format 2020-11-23
 *
 * @returns {Promise<object>}
 */
export function fetchPractitionerOverviewData(authId, date) {
  return api.get(`/practitioner/${authId}/dashboard/${date}`);
}

/**
 * @returns {Promise<object>}
 */
export function createCalendarBlock(data) {
  return BEApi.post('/practitioners/calendar-block', data);
}

/**
 * @returns {Promise<object>}
 */
export function fetchCalendarBlocks() {
  return BEApi.get('/practitioners/calendar-block');
}

/**
 * @returns {Promise<object>}
 */
export function editCalendarBlock(data, calendarBlockId) {
  return BEApi.put(`/practitioners/calendar-block/${calendarBlockId}`, data);
}

/**
 * @returns {Promise<object>}
 */
export function fetchCalendarBlock(calendarBlockId) {
  return BEApi.get(`/practitioners/calendar-block/${calendarBlockId}`);
}

/**
 * @returns {Promise<object>}
 */
export function removeCalendarBlock(calendarBlockId) {
  return BEApi.delete(`/practitioners/calendar-block/${calendarBlockId}`);
}

/**
 * @returns {Promise<object>}
 */
export function createBooking(data) {
  return BEApi.post('/practitioners/create-booking', data);
}

/**
 * Fetch patients with vitals
 *
 * @returns {Promise<object>}
 */
export async function fetchPatientsWithVitals(searchText, dispatch) {
  dispatch(showSpinner());
  const query = `?${searchText ? `searchText=${searchText}` : ''}`;
  const { data } = await BEApi.get(`/patients/vitals/${query}`);
  dispatch(hideSpinner());
  return data?.patients;
}

export const usePatientsVitals = (searchText, dispatch) => {
  return useQuery(['patientsVitals'], () =>
    fetchPatientsWithVitals(searchText, dispatch),
  );
};

/**
 * Fetch patients with Risk data
 *
 * @returns {Promise<object>}
 */
export async function fetchPatientsWithRiskData(practitionerId) {
  const { data } = await api.get(`practitioner/${practitionerId}/riskdata`);
  return data;
}

export const usePatientsRiskData = (practitionerId) => {
  return useQuery(['patientsRiskData', practitionerId], () =>
    practitionerId ? fetchPatientsWithRiskData(practitionerId) : [],
  );
};
