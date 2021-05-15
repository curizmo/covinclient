import { api, BEApi } from './api';

export const getSpecialtyList = async () => {
  const { data } = await api.get('/specialty');
  return data;
};

/**
 * @returns {Promise<object>}
 */
export function getSpecialties() {
  return BEApi.get('/specialty');
}
