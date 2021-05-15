import * as yup from 'yup';

import { getStartOfDayToday } from 'utils/dateTime';

export const createCalendarBlockValidation = yup.object().shape({
  startDate: yup
    .date()
    .required('The start date is required field')
    .min(getStartOfDayToday(), 'The date cannot be selected in past'),
  endDate: yup
    .date()
    .required('The end date is required field')
    .min(yup.ref('startDate'), 'The date cannot be before the start date'),
  startTime: yup.string().required('The Start Time is a required field'),
  endTime: yup.string().required('The End Time is a required field'),
});
