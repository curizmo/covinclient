import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'components/common/Layout';
import { LanguageProvider } from 'components/common/LanguageProvider';
import { ErrorFallback } from 'components/common/ErrorFallback';
import { TopMenu } from 'components/common/TopMenu';

import { routes } from '../';
import { useInitScroll } from 'hooks/useInitScroll';
import { clearMessage, hideSpinner } from 'actions';
import { getIsLoginInProgress, getIsShowSpinner, getUser } from 'selectors';
import { getAuthData } from 'utils/auth';

const RouterSwitch = () => {
  const routesKeys = Object.keys(routes);
  const { isLoggedIn } = getAuthData();
  const isShowSpinner = useSelector(getIsShowSpinner);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const isLoginInProgress = useSelector(getIsLoginInProgress);

  useEffect(() => {
    dispatch(clearMessage());
    dispatch(hideSpinner());
  }, [dispatch]);

  useInitScroll();

  return (
    <Switch>
      {routesKeys.map((key) => {
        const { isPrivate, component: Component, exact } = routes[key];
        const redirectPath =
          isPrivate && !isLoggedIn && user
            ? routes.login.path
            : !user.isPractitioner && !isLoginInProgress
            ? routes.nonPhysician.path
            : null;

        return (
          <Route key={key} path={routes[key].path} exact={exact}>
            <LanguageProvider>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div className={isShowSpinner ? 'blur-content' : ''}>
                  <TopMenu />
                  <Layout key={key} isPrivate={isPrivate}>
                    {!['login', 'nonPhysician'].includes(key) &&
                    redirectPath ? (
                      <Redirect to={redirectPath} />
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
