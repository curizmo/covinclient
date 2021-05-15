import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, ReactReduxContext } from 'react-redux';
import { QueryClientProvider, QueryClient } from 'react-query';

import { store } from './store';
import { SpinnerPortal } from 'components/common/SpinnerPortal';

import { RouterSwitch } from './routers/RouterSwitch';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Provider store={store} context={ReactReduxContext}>
          <Suspense fallback={<SpinnerPortal />}>
            <Router>
              <RouterSwitch />
            </Router>
          </Suspense>
        </Provider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
