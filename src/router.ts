import { Credentials } from './components/Credentials';
import { APIs } from './components/Apis';
import { Logs } from './components/Logs';
import { Sessions } from './components/Sessions';
import { Tasks } from './components/Tasks';
import { InvalidPath } from './components/_common/InvalidPath';
import { route, routerFactory } from './lib/Router';

export const routes = {
  '/credentials': route({ name: 'CREDENTIALS', component: Credentials }),
  '/logs': route({ name: 'LOGS', component: Logs }),
  '/sessions': route({ name: 'SESSIONS', component: Sessions }),
  '/apis': route({ name: 'DATA SOURCES', component: APIs }),
  '/tasks': route({ name: 'TASKS', component: Tasks }),
} as const;

export const { RouterProvider, useRouter } = routerFactory({
  window,
  routes,
  InvalidPath,
  homePath: '/credentials',
});

export type AllRoutes = typeof routes;
