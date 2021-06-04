import * as yup from 'yup';

import {
  firstName,
  lastName,
  phone,
  heightFt,
  heightIn,
  weight,
} from './schema';

export const patientValidation = yup.object().shape({
  firstName,
  lastName,
  phone,
  heightFt,
  heightIn,
  weight,
});
