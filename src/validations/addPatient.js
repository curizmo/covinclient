import * as yup from 'yup';

import { firstName, lastName, phone, height } from './schema';

export const patientValidation = yup.object().shape({
  firstName,
  lastName,
  phone,
  height,
});
