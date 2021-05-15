import * as yup from 'yup';
import { firstName, lastName } from './schema';
import parsePhoneNumber from 'libphonenumber-js';

export const patientProfileValidation = yup.object().shape({
  firstName,
  lastName,
  dateOfBirth: yup.date().required('Date is required Field'),
  phone: yup
    .string()
    .required('Phone Number is required field')
    .test('is-phone-valid', 'Phone number is invalid', (value) => {
      const phoneNumber = parsePhoneNumber(value);

      if (phoneNumber) {
        return phoneNumber.isValid();
      }
      return false;
    }),
  patientHealthNumber: yup
    .string()
    .required('Patient Health Number is required'),
  insuranceProvider: yup.string().required('Insurance Provide is required'),
  insuranceID: yup.string().required('Insurance ID is required'),
  address1: yup.string().required('Primary Address is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  zip: yup.string().required('Zip is required'),
  country: yup.string().required('Country is required'),
});
