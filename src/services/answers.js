import config from '../config/config';
// @toDo replace fetch with axios

export const postQuestionAnswer = ({
  isUnanswered,
  question,
  idToken,
  setError,
}) => {
  const endpoint = isUnanswered ? 'updateQuestion' : 'editAnswers';
  return fetch(`${config.domainURL}/${endpoint}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      idToken,
    },
    body: JSON.stringify({ ...question }),
  })
    .then((response) => {
      setError('');
      return response;
    })
    .catch((error) => setError(error));
};

export const postAnswer = ({ idToken, answer }) => {
  return fetch(`${config.domainURL}/addanswer`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      idToken,
    },
    body: JSON.stringify({ ...answer }),
  });
};

export const editAnswer = ({ idToken, answer }) => {
  return fetch(`${config.domainURL}/editanswer`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      idToken,
    },
    body: JSON.stringify({ ...answer }),
  });
};

export const deleteAnswer = ({ idToken, answer }) => {
  return fetch(`${config.domainURL}/deleteanswer`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      idToken,
    },
    body: JSON.stringify({ ...answer }),
  });
};
