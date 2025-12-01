import React from 'react';
import type { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <div>Home SSR</div>,
  },
  {
    path: '/about',
    element: <div>About SSR</div>,
  },
];
