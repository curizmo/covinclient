import * as yup from 'yup';

import { firstName, lastName } from './schema';

export const practitionerProfile = yup.object().shape({
  firstName,
  lastName,
});
