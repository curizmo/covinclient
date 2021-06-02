// Regex to check that string starts with "image/""
export const IMAGE_TYPE_REGEX = /^image\//;

// Regex that allows only characters, numbers, and - or _ in between.
// TODO: Add tests for this regex.
export const SUBDOMAIN_REGEX = new RegExp(
  '^(([a-z0-9]+)([-_]{0,1})([a-z0-9]+))*$',
);

// Source:https://stackoverflow.com/questions/52483260/validate-phone-number-with-yup
export const PHONE_SCHEMA = /^(\(?[0-9]{2,4}\)?[-]?)*([0-9]{2,4})$/;

export const HEIGHT_SCHEMA = /^([0-9]{1,2}'[0-9]{1,2}")?$/;

export const CAMEL_CASE_REGEX = /([A-Z])/g;
