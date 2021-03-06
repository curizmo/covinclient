/* eslint-disable no-param-reassign */
import {
  FETCH_ALL_QUESTION,
  FETCH_ALL_QUESTION_FAILURE,
  ADD_QUESTION,
  SEARCH_QUESTIONS,
  SET_LOADING,
  SET_SEARCHTERM,
  RESET_SEARCH_RESULT,
  ADD_QUESTION_SUCCESS,
  ADD_QUESTION_FAILURE,
  FETCH_ALL_UNANSWERED_QUESTION,
  DISMISS_MESSAGE,
  LIKE_QUESTION_SUCCESS,
  LIKE_ANSWER_SUCCESS,
  DISLIKE_ANSWER_SUCCESS,
  SET_ANSWERS_BY_QUESTION,
  NEW_QUESTION_ANSWERED,
  DELETE_ANSWERED_QUESTION_SUCCESS,
  DELETE_UNANSWERED_QUESTION_SUCCESS,
} from '../constants/ActionTypes';

import config from '../config/config';
import { sortQuestions } from '../utils/sort';
// export const fetchQuestion = () => ({
//   type: FETCH_ALL_QUESTION
// })
export const addQuestion = () => ({
  type: ADD_QUESTION,
});

// export const updatedQuestionSuccess = (questions) => ({
//   type: ADD_QUESTION_SUCCESS,
//   submitted: true
//
// })

const dismissMessage = () => ({
  type: DISMISS_MESSAGE,
  messageActive: false,
});

export const deleteQuestionSuccess = (qIdx, isUnanswered) => (dispatch) => {
  if (isUnanswered) {
    dispatch({
      type: DELETE_UNANSWERED_QUESTION_SUCCESS,
      qIdx,
    });

    return;
  }

  dispatch({
    type: DELETE_ANSWERED_QUESTION_SUCCESS,
    qIdx,
  });
};

export const addQuestionSuccess = (q) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(dismissMessage());
      // dispatch(resetSearchResult())
    }, 6000);

    return dispatch({
      type: ADD_QUESTION_SUCCESS,
      addSuccess: true,
      newQuestion: q,
      messageActive: true,
    });
  };
};

export const addQuestionFailure = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(dismissMessage());
    }, 6000);

    return dispatch({
      type: ADD_QUESTION_FAILURE,
      addSuccess: false,
      messageActive: true,
    });
  };
};

export const fetchQuestionsFailure = (error) => ({
  type: FETCH_ALL_QUESTION_FAILURE,
  payload: { error },
});

export const receiveQuestions = (questions) => ({
  type: FETCH_ALL_QUESTION,
  questions,
});

export const receiveUnansweredQuestions = (questions) => ({
  type: FETCH_ALL_UNANSWERED_QUESTION,
  questions,
});

export const searchQuestions = (questions, searchTerm) => (dispatch) => {
  return dispatch({
    type: SEARCH_QUESTIONS,
    questions,
    searchTerm,
  });
};

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  isLoading,
});
export const setSearchTerm = (searchTerm) => ({
  type: SET_SEARCHTERM,
  searchTerm,
});

export const setAnswerForQuestion = (idx, answers) => ({
  type: SET_ANSWERS_BY_QUESTION,
  idx,
  answers,
});

export const resetSearchResult = () => ({
  type: RESET_SEARCH_RESULT,
});

export const handleNewQuestionAnswered = (question) => (dispatch) => {
  dispatch({
    type: NEW_QUESTION_ANSWERED,
    question,
  });
};

export const changeLanguage = (selectLanguage) => {
  const lang = selectLanguage;
  return (dispatch) => {
    return fetch(`${config.domainURL}/changeLanguage`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        language: lang,
      },
      body: JSON.stringify({ language: lang }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Couldn't fetch questions");
        }
        return response.json();
      })
      .then((json) => {
        json = sortQuestions(json);

        dispatch(receiveQuestions(json));
      })
      .catch((error) => {
        // @toDo handle error
        console.error(error);
      });
  };
};

export const fetchQuestions = () => {
  return (dispatch) => {
    return fetch(`${config.domainURL}/questions`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Couldn't fetch questions");
        }
        return response.json();
      })
      .then((json) => {
        json = sortQuestions(json);

        dispatch(receiveQuestions(json));
      })
      .catch((error) => {
        // @toDo handle error
        console.error(error);
      });
  };
};

export const fetchUnansweredQuestions = () => {
  return (dispatch) => {
    return fetch(`${config.domainURL}/questions/unanswered`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Couldn't fetch questions");
        }
        return response.json();
      })
      .then((json) => {
        json = sortQuestions(json);

        json = json.map((data) => {
          return {
            ...data,
            answers: [''],
          };
        });

        dispatch(receiveUnansweredQuestions(json));
      })
      .catch((error) => {
        // @toDo handle error
        console.error(error);
      });
  };
};

export const postQuestion = (title) => {
  return (dispatch) => {
    return fetch(`${config.domainURL}/addQuestion`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    })
      .then((response) => response.json())
      .then((json) => dispatch(addQuestionSuccess(json)))
      .catch((error) => {
        dispatch(addQuestionFailure(error));
      });
  };
};

export const deleteQuestion = (qId, idx, isUnanswered) => {
  return (dispatch) => {
    return fetch(`${config.domainURL}/deleteQuestion`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: qId }),
    }).then(() => dispatch(deleteQuestionSuccess(idx, isUnanswered)));
  };
};

export const increaseLike = (qId, idx) => {
  return (dispatch) => {
    let likeItems = localStorage.getItem('likeItems');
    likeItems = likeItems ? JSON.parse(likeItems) : {};
    likeItems[qId] = 1;
    localStorage.setItem('likeItems', JSON.stringify(likeItems));

    return dispatch({
      type: LIKE_QUESTION_SUCCESS,
      qIdx: idx,
    });
  };
};

export const increaseAnswerLike = (questionId, answerId) => {
  return (dispatch) => {
    return dispatch({
      type: LIKE_ANSWER_SUCCESS,
      questionId,
      answerId,
    });
  };
};

export const decreaseAnswerLike = (questionId, answerId) => {
  return (dispatch) => {
    return dispatch({
      type: DISLIKE_ANSWER_SUCCESS,
      questionId,
      answerId,
    });
  };
};

export const clickLikeQuestion = (qId, idx) => {
  let likeItems = localStorage.getItem('likeItems');
  likeItems = likeItems ? JSON.parse(likeItems) : {};

  return (dispatch) => {
    if (likeItems[qId]) return dispatch({ type: 'ALREADY_LIKE' });
    return fetch(`${config.domainURL}/question/like`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: qId }),
    })
      .then(() => dispatch(increaseLike(qId, idx)))
      .catch(() => {
        // dispatch(addQuestionFailure(error));
      });
  };
};

export const handleAnswerLike = (questionId, answerId) => {
  return (dispatch) => {
    return fetch(`${config.domainURL}/answer/like`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: answerId }),
    })
      .then(() => dispatch(increaseAnswerLike(questionId, answerId)))
      .catch(() => {
        // dispatch(addQuestionFailure(error));
      });
  };
};

export const handleAnswerDislike = (questionId, answerId) => {
  return (dispatch) => {
    return fetch(`${config.domainURL}/answer/dislike`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: answerId }),
    })
      .then(() => dispatch(decreaseAnswerLike(questionId, answerId)))
      .catch(() => {
        // dispatch(addQuestionFailure(error));
      });
  };
};
