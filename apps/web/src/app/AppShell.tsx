import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';

interface AppShellProps {
  router: React.ComponentProps<typeof RouterProvider>['router'];
  initialData?: any;
}

export const InitialDataContext = React.createContext<any | null>(null);

export function AppShell({ router, initialData }: AppShellProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="blog-theme">
      <InitialDataContext.Provider value={initialData ?? null}>
        <RouterProvider router={router} />
      </InitialDataContext.Provider>
    </ThemeProvider>
  );
}
