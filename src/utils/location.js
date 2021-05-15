import { basedConfig } from '../config/index';

/**
 * @param {string} const subdomain
 * @param {string} const pathname
 * @return {string}
 */
export const getLocationWithSubdomain = ({ subdomain, pathname }) => {
  const { protocol, host } = window.location;
  return `${protocol}//${subdomain}.${host}${pathname || ''}`;
};

/**
 * @return {string}
 */
export const getLocationSubdomain = () => {
  const { hostname } = window.location;
  if (basedConfig.domainURL.includes(hostname)) {
    return '';
  }
  const subdomains = hostname.replace(/^www\./, '').split('.');
  return subdomains.length > 1 ? subdomains[0] : '';
};
