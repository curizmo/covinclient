import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import { rootSaga } from './sagas';
import { appReducer } from './reducers';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
};

const configureStore = (initialState = {}) => {
  const middleWares = [sagaMiddleware, thunk];
  const persistedReducer = persistReducer(persistConfig, appReducer);

  const store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleWares)),
  );

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers/index', () =>
      store.replaceReducer(persistedReducer),
    );
  }
  return store;
};

const store = configureStore();
const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

export { store, persistor };
