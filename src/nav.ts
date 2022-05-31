import { navFactory, Navigation } from './lib/navFactory';
import { AllRoutes } from './router';

const nav = navFactory<AllRoutes>();

export const navigation: Navigation<AllRoutes> = [
  nav({ name: 'LOGS', route: '/logs' }),
  nav({ name: 'CREDENTIALS', route: '/credentials' }),
  nav({ name: 'SESSIONS', route: '/sessions' }),
  nav({ name: 'DATA SOURCES', route: '/data-sources' }),
  nav({ name: 'TASKS', route: '/tasks' }),
];
