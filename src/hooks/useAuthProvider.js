import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { loginRequest, GRAPH_ENDPOINTS } from '../config/authConfig';
import {
  msalApp,
  requiresInteraction,
  fetchMsGraph,
  getAuthData,
} from '../utils/auth';
import { login } from '../services/auth';
import { setUser, clearUser } from '../actions/user';
import { logout } from '../actions/auth';
import { showSpinner, hideSpinner } from './../actions/spinner';
import { startLogin, endLogin } from './../actions/login';
import { getIsLoginInProgress, getUser } from '../selectors';
import { routes } from '../routers';

export const useAuthProvider = () => {
  // @toDo get this message from translations
  const loginFailedMessage = 'Login failed';
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoginInProgress = useSelector(getIsLoginInProgress);
  const user = useSelector(getUser);

  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [graphProfile, setGraphProfile] = useState(null);
  const [isLoginFinished, setIsLoginFinished] = useState(false);

  const handleUserLogin = useCallback(async () => {
    dispatch(showSpinner());
    const { accessToken } = getAuthData();
    try {
      const response = (await login(accessToken)) || {};
      if (response.data && response.data.user) {
        dispatch(setUser({ ...response.data.user, isLoggedIn: true }));
        setIsLoginFinished(true);
      } else {
        console.error(loginFailedMessage);
      }
    } catch (error) {
      console.error(error || loginFailedMessage);
    }
    dispatch(endLogin());
    dispatch(hideSpinner());
  }, [dispatch]);

  useEffect(() => {
    if (isLoginFinished) {
      if (user && user.isFirstTimeSignUp) {
        history.push(routes.physicianSignup.path);
      } else if (user) {
        history.push(routes.dashboard.path);
      } else {
        history.push(routes.login.path);
      }
      setIsLoginFinished(true);
    }
  }, [isLoginFinished, history, user]);

  useEffect(() => {
    if (isLoginInProgress) {
      msalApp.handleRedirectCallback((error) => {
        if (error) {
          setError(
            error.errorMessage
              ? error.errorMessage
              : 'Unable to acquire access token.',
          );
        }

        handleUserLogin();
      });
    }

    const account = msalApp.getAccount();
    const { accessToken } = getAuthData();

    setAccount({
      ...account,
      accessToken,
    });

    if (account) {
      const loginSilently = async () => {
        const tokenResponse = await acquireToken();

        if (tokenResponse) {
          const graphProfile = await fetchMsGraph(
            GRAPH_ENDPOINTS.ME,
            tokenResponse.accessToken,
          ).catch(() => {
            setError('Unable to fetch Graph profile.');
          });

          if (graphProfile) {
            setGraphProfile(graphProfile);
          }
        }
      };

      loginSilently();
    }

    return () => {};
  }, [handleUserLogin, isLoginInProgress]);

  const acquireToken = async () => {
    return msalApp
      .acquireTokenSilent(loginRequest)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
        // due to consent or interaction required ONLY
        if (requiresInteraction(error.errorCode)) {
          return msalApp.acquireTokenRedirect(loginRequest);
        } else {
          setError('Non-interactive error:', error.errorCode);
        }
      });
  };

  const onSignIn = async () => {
    dispatch(startLogin());
    msalApp.loginRedirect(loginRequest);
  };

  const onSignUp = async () => {
    // @toDo add signup specific
    onSignIn();
  };

  const onSignOut = async () => {
    dispatch(logout());
    dispatch(clearUser());
    await msalApp.logout();
    onSignIn();
  };

  return {
    account,
    error,
    setAccount,
    setError,
    onSignIn,
    onSignUp,
    onSignOut,
    acquireToken,
    graphProfile,
    goHome: () => history.push(routes.dashboard.path),
  };
};
