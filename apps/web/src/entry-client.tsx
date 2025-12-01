import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes/routes';
import { AppShell } from './app/AppShell';

declare global {
  interface Window {
    __INITIAL_DATA__?: any;
  }
}

const router = createBrowserRouter(routes);

hydrateRoot(
  document.getElementById('root')!,
  <React.StrictMode>
    <AppShell router={router} initialData={window.__INITIAL_DATA__} />
  </React.StrictMode>
);
