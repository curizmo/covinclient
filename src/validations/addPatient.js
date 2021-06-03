import * as yup from 'yup';

import { firstName, lastName, phone, heightFt, heightIn } from './schema';

export const patientValidation = yup.object().shape({
  firstName,
  lastName,
  phone,
  heightFt,
  heightIn,
});
