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
  .required('Cellphone Number is required field')
  .matches(
    PHONE_SCHEMA,
    'Cellphone Number is not valid: it should contain only numbers, dashes and brackets, and finish with number(s)',
  );

export const title = yup
  .string()
  .required('Title is required field')
  .min(5, 'The title is too short');

export const height = yup
  .string()
  .nullable(true)
  .matches(HEIGHT_SCHEMA, "Height is not valid, example of height: 6'9''");

export const heightFt = yup
  .number()
  .positive()
  .integer('Feet should be a positive number')
  .max(7, 'Feet should be less than 7')
  .nullable(true)
  .transform((value) => (isNaN(value) ? null : value));

export const heightIn = yup
  .number()
  .positive()
  .integer('Inches should be a positive number')
  .max(11, 'Inches should be less than 11')
  .nullable(true)
  .transform((value) => (isNaN(value) ? null : value));

export const description = yup
  .string()
  .required('Description is required field')
  .min(10, 'Please provide more description');
