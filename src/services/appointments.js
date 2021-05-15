import camelcaseKeys from 'camelcase-keys';

import { api } from './api';
import { APPOINTMENTS_VIEW, APPOINTMENTS_VIEW_ENUM } from '../constants';
import { getISODate } from 'utils';
import { useInfiniteQuery, useQuery } from 'react-query';

/**
 * @param {string} subdomain
 * @param {cancelToken} cancelToken
 * @returns {Promise<object>}
 */

export async function fetchAppointments({ user, status, cancelToken }) {
  const statusQuery =
    status === APPOINTMENTS_VIEW.TODAYS
      ? `${APPOINTMENTS_VIEW.UPCOMING}/${getISODate(new Date())}`
      : `${status}`;
  const { data } = await api.get(
    `/${user.isPractitioner ? 'practitioner' : 'user'}/${
      user.AuthID
    }/bookings/${statusQuery}`,
    {
      headers: {
        'Content-type': 'application/json',
      },
      cancelToken,
    },
  );

  return data.map((value) => camelcaseKeys(value));
}

export function useAppointments({
  user,
  status,
  page,
  fromDate,
  toDate,
  searchText,
  sortField,
}) {
  return useQuery(
    [
      'fetchappointments',
      status,
      page,
      fromDate,
      toDate,
      user.AuthID,
      searchText,
      `${sortField.colName} ${sortField.sortOrder}`,
    ],
    async () => {
      const request = {
        authId: user.AuthID,
        currentDate: getISODate(new Date()),
        status:
          status === APPOINTMENTS_VIEW.TODAYS
            ? APPOINTMENTS_VIEW_ENUM.TODAYS
            : status === APPOINTMENTS_VIEW.UPCOMING
            ? APPOINTMENTS_VIEW_ENUM.UPCOMING
            : APPOINTMENTS_VIEW_ENUM.CLOSED,
        page,
        fromDate,
        toDate,
        searchText,
        sortField: `${sortField.colName} ${sortField.sortOrder}`,
      };

      const { data } = await api.post(
        `/${
          user.isPractitioner ? 'practitioner' : 'user'
        }/getpractitionerappointmentsbypage`,
        request,
      );

      return {
        totalRecords: data.totalRecords,
        appointments: data.appointments.map((value) => camelcaseKeys(value)),
      };
    },
    {
      enabled: !!user,
      keepPreviousData: true,
    },
  );
}

export function useAppointmentsMobile({
  user,
  status,
  fromDate,
  toDate,
  searchText,
}) {
  return useInfiniteQuery(
    ['fetchappointments', status, fromDate, toDate, user.AuthID, searchText],
    async ({ pageParam = 0 }) => {
      const request = {
        authId: user.AuthID,
        currentDate: getISODate(new Date()),
        status:
          status === APPOINTMENTS_VIEW.TODAYS
            ? APPOINTMENTS_VIEW_ENUM.TODAYS
            : status === APPOINTMENTS_VIEW.UPCOMING
            ? APPOINTMENTS_VIEW_ENUM.UPCOMING
            : APPOINTMENTS_VIEW_ENUM.CLOSED,
        page: pageParam,
        fromDate,
        toDate,
        searchText,
      };

      const { data } = await api.post(
        `/${
          user.isPractitioner ? 'practitioner' : 'user'
        }/getpractitionerappointmentsbypage`,
        request,
      );

      return {
        totalRecords: data.totalRecords,
        appointments: data.appointments.map((value) => camelcaseKeys(value)),
      };
    },
    {
      enabled: !!user,
    },
  );
}
