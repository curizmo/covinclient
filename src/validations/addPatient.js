import * as yup from 'yup';

import { firstName, lastName, email, phone, height } from './schema';

export const patientValidation = yup.object().shape({
  firstName,
  lastName,
  email,
  phone,
  height,
});
