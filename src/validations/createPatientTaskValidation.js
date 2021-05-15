import * as yup from 'yup';

import { title, description } from './schema';

import { getStartOfDayToday } from 'utils/dateTime';

export const createPatientTaskValidation = yup.object().shape({
  title,
  description,
  startTime: yup
    .date()
    .required('The Start Date is a required field')
    .min(getStartOfDayToday(), "The date can't be selected before time"),
  endTime: yup
    .date()
    .required('The End Date is a required field')
    .min(yup.ref('startTime'), "End Date can't exist before start date"),
});
