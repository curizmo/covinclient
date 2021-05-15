import { BEApi } from './api';

/**
 * @param {string} [view]
 * @returns {Promise<object>}
 */
export function getEncounterFile(fileName) {
  return BEApi.get(`/file/encounter/${fileName}`, {
    responseType: 'blob',
  });
}
