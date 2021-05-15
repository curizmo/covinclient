import { PHONE_SCHEMA, HEIGHT_SCHEMA } from '../constants';

import * as yup from 'yup';

export const firstName = yup.string().required('First Name is required field');
export const lastName = yup.string();

export const email = yup
  .string()
  .required('Email is required field')
  .email('Please enter valid Email Address');
export const phone = yup
  .string()
  .nullable(true)
  .matches(
    PHONE_SCHEMA,
    'Phone Number is not valid: it should start from +91- and contain only numbers, dashes and brackets',
  );

export const title = yup
  .string()
  .required('Title is required field')
  .min(5, 'The title is too short');

export const height = yup
  .string()
  .nullable(true)
  .matches(HEIGHT_SCHEMA, "Height is not valid, example of height: 6'9''");

export const description = yup
  .string()
  .required('Description is required field')
  .min(10, 'Please provide more description');
