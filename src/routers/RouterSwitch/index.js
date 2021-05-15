import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from '../../components/common/Layout';
import { LanguageProvider } from '../../components/common/LanguageProvider';
import { ErrorFallback } from '../../components/common/ErrorFallback';
import { TopMenu } from '../../components/common/TopMenu';

import { routes } from '../';
import { useInitScroll } from '../../hooks/useInitScroll';
import { clearMessage } from '../../actions/message';
import { hideSpinner } from '../../actions/spinner';
import { getIsShowSpinner } from '../../selectors';
import { getAuthData } from '../../utils/auth';

const RouterSwitch = () => {
  const routesKeys = Object.keys(routes);
  const { isLoggedIn } = getAuthData();
  const isShowSpinner = useSelector(getIsShowSpinner);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearMessage());
    dispatch(hideSpinner());
  }, [dispatch]);

  useInitScroll();

  return (
    <Switch>
      {routesKeys.map((key) => {
        const { isPrivate, component: Component, exact } = routes[key];
        const isRedirectToLogin = isPrivate && !isLoggedIn;

        return (
          <Route key={key} path={routes[key].path} exact={exact}>
            <LanguageProvider>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div className={isShowSpinner ? 'blur-content' : ''}>
                  <TopMenu />
                  <Layout key={key} isPrivate={isPrivate}>
                    {isRedirectToLogin ? (
                      <Redirect to={routes.login.path} />
                    ) : (
                      <Component />
                    )}
                  </Layout>
                </div>
              </ErrorBoundary>
            </LanguageProvider>
          </Route>
        );
      })}
      <Redirect push to={routes.dashboard.path} />
    </Switch>
  );
};

export { RouterSwitch };
