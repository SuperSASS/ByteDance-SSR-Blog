import React from 'react';
import { RouterProvider } from 'react-router-dom';

interface AppShellProps {
  router: React.ComponentProps<typeof RouterProvider>['router'];
  initialData?: any;
}

export const InitialDataContext = React.createContext<any | null>(null);

export function AppShell({ router, initialData }: AppShellProps) {
  return (
    <InitialDataContext.Provider value={initialData ?? null}>
      <RouterProvider router={router} />
    </InitialDataContext.Provider>
  );
}
