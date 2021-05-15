import { BEApi } from './api';

export const postQuestionToRay = async (question, answer, index) => {
  return await BEApi.post('/ray/qna', { question, answer, index });
};
