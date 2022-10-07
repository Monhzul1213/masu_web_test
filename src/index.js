import React from 'react';
import { createRoot } from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import 'antd/dist/antd.min.css';

import './i18n';
import './index.css';
import { App as Screen } from './App';
import { Loading } from './pages';
import { store, persistor } from './helpers/store';

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Screen />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);