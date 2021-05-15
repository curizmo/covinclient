import { CancelToken, create } from 'axios';
import { call, cancelled, put } from 'redux-saga/effects';

import { axiosRequestTimeout, basedConfig } from '../config';
import { cancelRequestMessage } from '../constants';
import { setErrorMessage } from '../actions/message';

import { getAuthData, msalApp } from 'utils/auth';

import { store } from 'store';
import { logout } from 'actions/auth';

export const api = create({
  baseURL: process.env.REACT_APP_API_HOSTNAME,
  timeout: axiosRequestTimeout,
});

export const dotnetapi = create({
  baseURL: process.env.REACT_APP_DOMAIN_DOTNETURL,
  timeout: axiosRequestTimeout,
});

export const BEApi = create({
  baseURL: `${basedConfig.domainURL}`,
  timeout: axiosRequestTimeout,
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = getAuthData();

    return {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...config.headers,
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err && err.response && err.response.status === 401) {
      store && store.dispatch(logout());
      msalApp.logout();

      return;
    }

    throw err;
  },
);

BEApi.interceptors.request.use(
  (config) => {
    const { accessToken } = getAuthData();

    return {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...config.headers,
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  },
);

BEApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err && err.response && err.response.status === 401) {
      store && store.dispatch(logout());
      msalApp.logout();

      return;
    }

    throw err;
  },
);

/**
 * @typedef {object} ApiConfig
 * @property {object} cancelToken
 */

/**
 * @returns {ApiConfig, Signal}
 */
export const getApiConfig = () => {
  const signal = CancelToken.source();
  const cancelToken = signal.token;
  const apiConfig = { cancelToken };
  return { apiConfig, signal };
};

/**
 * @param {function} getDataAsync
 * @param {function} onSuccessAction
 * @param {function} onFailAction
 * @param {params} params
 * @returns {Generator<*>}
 */
export function* fetchData(
  getDataAsync,
  onSuccessAction,
  params = null,
  onFailAction = null,
) {
  const { apiConfig, signal } = yield getApiConfig();
  try {
    const data = params
      ? yield call(getDataAsync, { ...apiConfig, ...params })
      : yield call(getDataAsync, apiConfig);
    yield put({ type: 'FETCH_SUCCEEDED' });
    yield put(onSuccessAction(data));
  } catch (error) {
    yield put({ type: 'FETCH_FAILED', error });
    if (onFailAction) {
      yield put(onFailAction());
    } else {
      yield put(
        setErrorMessage({ header: 'Error', message: error.toString() }),
      );
    }
  } finally {
    if (yield cancelled()) {
      signal.cancel(cancelRequestMessage);
    }
  }
}

/**
 * @param {function} postDataAsync
 * @param {function} onSuccessAction
 * @param {params} params
 * @returns {Generator<*>}
 */
export function* postData(postDataAsync, onSuccessHandler, params = null) {
  const { apiConfig, signal } = yield getApiConfig();
  try {
    const data = yield call(postDataAsync, { ...apiConfig, ...params });
    yield put({ type: 'POST_SUCCEEDED' });
    yield call(onSuccessHandler, data);
  } catch (error) {
    yield put({ type: 'POST_FAILED', error });
    yield put(setErrorMessage({ header: 'Error', message: error }));
  } finally {
    if (yield cancelled()) {
      signal.cancel(cancelRequestMessage);
    }
  }
}
