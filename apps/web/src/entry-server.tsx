import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryRouter } from 'react-router-dom';
import { routes } from './routes/routes';
import { AppShell } from './app/AppShell';

export function render(url: string, initialData: any) {
  const router = createMemoryRouter(routes, {
    initialEntries: [url],
  });

  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <AppShell router={router} initialData={initialData} />
    </React.StrictMode>
  );
}
