import { UserAgentApplication } from 'msal';

import { msalConfig } from '../../config/authConfig';

const parseJwt = (token) => {
  try {
    return JSON.parse(
      atob(token.split('.')[1].replace('-', '+').replace('_', '/')),
    );
  } catch (e) {
    return {};
  }
};

export { isIE, requiresInteraction, fetchMsGraph } from './authHelper';

export const msalApp = new UserAgentApplication({ ...msalConfig });

export const getAuthData = () => {
  const accessToken = window.localStorage.getItem('msal.idtoken');
  const account = parseJwt(accessToken);

  return {
    isLoggedIn: !!accessToken,
    account,
    accessToken,
  };
};
