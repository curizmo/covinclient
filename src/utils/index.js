import { routes } from '../routers';
import { PATH_PARAMS } from '../constants';

export * from './dateTime';
export * from './patient';
export * from './random';
export * from './rangeCheck';

let tabIndex = 0;

export const getLanguage = () => window.localStorage.getItem('i18nextLng');

export { getLocationWithSubdomain, getLocationSubdomain } from './location';

export const getTabIndex = () => tabIndex++;

export const keys = {
  enter: {
    name: 'Enter',
    code: 13,
  },
};

export const isKeyPressed = (event, key) =>
  event.which === key.code ||
  event.keyCode === key.code ||
  event.key === key.name;

export const limit = (arr, n) => {
  if (n > arr.length) return [];
  return arr.slice(0, n);
};

export const getOrganizationPath = (subdomain, path) => {
  return path.replace(PATH_PARAMS.subdomain, subdomain ? `/${subdomain}` : '');
};

export const getLobbyPath = (subdomain) => {
  return getOrganizationPath(subdomain, routes.lobby.path);
};

/**
 *
 * @param {Object} errors
 * @param {string} key
 * @returns string
 */
export const getErrorMessage = (errors, key) => {
  return errors?.[key]?.message ?? '';
};

/**
 *
 * @param {Object} object
 *
 * @returns {Array}
 */
export const arrayObjectFixer = (object) => {
  let result = [];
  for (let [key, value] of Object.entries(object)) {
    result.push([key, value]);
  }
  return result;
};

/**
 *
 * @param {String} str
 *
 * @returns {String}
 */
export const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.substring(1);
