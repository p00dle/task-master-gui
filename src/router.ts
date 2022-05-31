import { Credentials } from './components/Credentials';
import { DataSources } from './components/DataSources';
import { Logs } from './components/Logs';
import { Sessions } from './components/Sessions';
import { Tasks } from './components/Tasks';
import { InvalidPath } from './components/_common/InvalidPath';
import { route, routerFactory } from './lib/Router';

export const routes = {
  '/credentials': route({ name: 'CREDENTIALS', component: Credentials }),
  '/logs': route({ name: 'LOGS', component: Logs }),
  '/sessions': route({ name: 'SESSIONS', component: Sessions }),
  '/data-sources': route({ name: 'DATA SOURCES', component: DataSources }),
  '/tasks': route({ name: 'TASKS', component: Tasks }),
} as const;

export const { RouterProvider, useRouter } = routerFactory({
  window,
  routes,
  InvalidPath,
  homePath: '/credentials',
});

export type AllRoutes = typeof routes;
