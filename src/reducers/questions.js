import {
  incrementQuestionLikes,
  getQuestions,
  incrementAnswerLikes,
  decrementAnswerLikes,
} from '../utils/questions';
import {
  ADD_QUESTION,
  FETCH_ALL_QUESTION,
  SET_LOADING,
  SET_SEARCHTERM,
  SEARCH_QUESTIONS,
  RESET_SEARCH_RESULT,
  ADD_QUESTION_SUCCESS,
  ADD_QUESTION_FAILURE,
  FETCH_ALL_UNANSWERED_QUESTION,
  DISMISS_MESSAGE,
  LIKE_QUESTION_SUCCESS,
  LIKE_ANSWER_SUCCESS,
  DISLIKE_ANSWER_SUCCESS,
  NEW_QUESTION_ANSWERED,
  DELETE_ANSWERED_QUESTION_SUCCESS,
  DELETE_UNANSWERED_QUESTION_SUCCESS,
} from '../constants/ActionTypes';

const initialState = {
  isLoading: false,
  questions: [],
  results: [],
  searchTerm: '',
  answeredQuestions: [],
  unansweredQuestions: [],
  newQuestion: {},
  addSuccess: () => {},
  messageActive: false,
};
const questions = (state = initialState, action) => {
  let result = 0;
  switch (action.type) {
    case FETCH_ALL_UNANSWERED_QUESTION:
      return {
        ...state,
        unansweredQuestions: action.questions,
      };

    case ADD_QUESTION:
      return {
        ...state,
      };
    case DISMISS_MESSAGE:
      return {
        ...state,
        messageActive: action.messageActive,
      };
    case ADD_QUESTION_FAILURE:
    case ADD_QUESTION_SUCCESS:
      return {
        ...state,
        newQuestion: action.newQuestion,
        addSuccess: action.addSuccess,
        messageActive: action.messageActive,
      };
    case FETCH_ALL_QUESTION:
      return {
        ...state,
        questions: action.questions,
        // @toDo remove results here and in other occurrences
        results: action.questions,
      };
    case NEW_QUESTION_ANSWERED:
      return {
        ...state,
        questions: [{ ...action.question }, ...state.questions],
        // @toDo remove results here and in other occurrences
        results: [{ ...action.question }, ...state.questions],
      };
    case SEARCH_QUESTIONS:
      return {
        ...state,
        questions: action.questions,
        searchTerm: action.searchTerm,
        // @toDo remove results here and in other occurrences
        results: getQuestions(action.questions, action.searchTerm),
        isLoading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SET_SEARCHTERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    case RESET_SEARCH_RESULT:
      return {
        ...state,
        searchTerm: '',
        result: state.questions,
      };
    case LIKE_QUESTION_SUCCESS:
      result = incrementQuestionLikes(state.questions, action.qIdx);
      return {
        ...state,
        questions: result,
        // @toDo remove results here and in other occurrences
        results: result,
      };
    case LIKE_ANSWER_SUCCESS:
      return {
        ...state,
        questions: incrementAnswerLikes(
          state.questions,
          action.questionId,
          action.answerId,
        ),
        // @toDo remove results here and in other occurrences
        results: incrementAnswerLikes(
          state.questions,
          action.questionId,
          action.answerId,
        ),
      };
    case DISLIKE_ANSWER_SUCCESS:
      return {
        ...state,
        questions: decrementAnswerLikes(
          state.questions,
          action.questionId,
          action.answerId,
        ),
      };
    case DELETE_UNANSWERED_QUESTION_SUCCESS:
      return {
        ...state,
        unansweredQuestions: state.unansweredQuestions.map(
          (question, index) => {
            return {
              ...question,
              // @toDo rename undeleted
              undeleted: index === action.qIdx,
            };
          },
        ),
      };
    case DELETE_ANSWERED_QUESTION_SUCCESS:
      return {
        ...state,
        answeredQuestions: state.questions.map((question, index) => {
          return {
            ...question,
            // @toDo rename undeleted
            undeleted: index === action.qIdx,
          };
        }),
      };

    default:
      return state;
  }
};
export default questions;
