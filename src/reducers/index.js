import { combineReducers } from 'redux';
import { organizations } from './organizations';
import { organization } from './organization';
import { message } from './message';
import { user } from './user';
import { spinner } from './spinner';
import { login } from './login';
import { cart } from './cart';
import { practitioner } from './practitioner';
import { appointment } from './appointment';
import { appointments } from './appointments';
import { twilio } from './twilio';
import { sidebar } from './sidebar';
import { patient } from './patient';
import { search } from './search';

import questions from './questions';
import physicianQuestion from './physicianQuestion';
import focusedQuestion from './focusedQuestion';

import { LOGOUT } from '../actions/auth';

export const createRootReducer = combineReducers({
  organizations,
  organization,
  questionBoard: questions,
  physician: physicianQuestion,
  focusedQuestion,
  message,
  user,
  spinner,
  appointment,
  login,
  cart,
  practitioner,
  appointments,
  twilio,
  sidebar,
  patient,
  search,
});

export const appReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return createRootReducer(state, action);
};
