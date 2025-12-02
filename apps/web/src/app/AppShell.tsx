import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { StaticRouterProvider, type StaticHandlerContext } from 'react-router';

type AppShellProps =
  | {
      type: 'client';
      router: React.ComponentProps<typeof RouterProvider>['router'];
    }
  | {
      type: 'server';
      router: React.ComponentProps<typeof RouterProvider>['router'];
      context: StaticHandlerContext;
    };

export function AppShell(props: AppShellProps) {
  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="blog-theme">
        {props.type === 'client' ? (
          <RouterProvider router={props.router} />
        ) : (
          <StaticRouterProvider router={props.router} context={props.context} />
        )}
      </ThemeProvider>
    </React.StrictMode>
  );
}
