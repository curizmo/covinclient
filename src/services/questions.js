import { BEApi } from './api';

/**
 * @returns {Promise<object>}
 */
export function searchQuestions(searchTerm) {
  return BEApi.get(`/questions/search/?search=${searchTerm}`);
}

/**
 * @returns {Promise<object>}
 */
export function createQuestion(data) {
  return BEApi.post('/addQuestion', data);
}
