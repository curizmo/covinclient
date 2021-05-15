import { api, BEApi } from './api';

export async function getUser({ authId, cancelToken }) {
  const { data } = await api.get(`/user/${authId}`, {
    headers: {
      'Content-type': 'application/json',
    },
    cancelToken,
  });
  return data[0];
}

export function fetchCurrentUser() {
  return BEApi.get('/users/me');
}
