/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Layout } from './components/layout/Layout';
import { RouterProvider } from './router';
import { ModalProvider } from './components/layout/Modal';

ReactDOM.render(
  <React.StrictMode>
    {/* @ts-ignore */}
    <RouterProvider>
      {/* @ts-ignore */}
      <ModalProvider>
        <Layout />
      </ModalProvider>
    </RouterProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
