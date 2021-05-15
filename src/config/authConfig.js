import { isIE } from '../utils/auth/authHelper';

export const GRAPH_SCOPES = {
  OPENID: 'openid',
  PROFILE: 'profile',
  USER_READ: 'User.Read',
  MAIL_READ: 'Mail.Read',
};

export const GRAPH_ENDPOINTS = {
  ME: 'https://graph.microsoft.com/v1.0/me',
  MAIL: 'https://graph.microsoft.com/v1.0/me/messages',
};

export const GRAPH_REQUESTS = {
  LOGIN: {
    scopes: [GRAPH_SCOPES.OPENID, GRAPH_SCOPES.PROFILE],
  },
};

export const fetchMsGraph = async (url, accessToken) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
};

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    authority: process.env.REACT_APP_AUTHORITY,
    validateAuthority: false,
    redirectUri: `${window.location.origin}`,
    postLogoutRedirectUri: `${window.location.origin}`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: isIE(), // Set this to 'true' if you are having issues on IE11 or Edge
  },
  system: {
    navigateFrameWait: 0,
    // @toDo remove logger for production
    logger: {
      /*eslint-disable */
      error: console.error,
      errorPii: console.error,
      info: console.log,
      infoPii: console.log,
      verbose: console.log,
      verbosePii: console.log,
      warning: console.warn,
      warningPii: console.warn,
      /*eslint-disable */
    },
  },
};

/**
 * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters,
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
 */
export const loginRequest = GRAPH_REQUESTS.LOGIN;
