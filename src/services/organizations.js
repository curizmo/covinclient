import { api } from './api';

/**
 * @param {CancelToken} cancelToken
 * @returns {Promise<object>}
 */
export async function getOrganizations({ cancelToken }) {
  const { data } = await api.get('/organization', {
    headers: {
      'Content-Type': 'application/json',
    },
    cancelToken,
  });
  return data;
}
