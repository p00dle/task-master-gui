/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as React from 'react';
import { useReducer, useEffect, createContext, useContext } from 'react';

export interface Route<T> {
  name: string;
  component: React.FC<T>;
  params?: Partial<Record<keyof T, string>>;
}

export type Routes = Record<string, Route<any>>;

export type RouterContextState<T extends Routes> = {
  RouteComponent: React.FC;
  route: keyof T;
  routeName: string;
  routeParams: T[keyof T]['params'];
  updateRoute: <R extends keyof T>(route: R, params?: T[R] extends Route<infer P> ? P : never) => void;
  updateRouteParams: (params: Partial<T[keyof T]['params']>) => void;
  stringifyRoute: <R extends keyof T>(route: R, params?: T[R]['params']) => string;
};

export type UseRouter<T extends Routes> = () => RouterContextState<T>;

export type RouteFactory = <T>(route: Route<T>) => Route<T>;

export interface WindowType {
  location: {
    href: string;
  };
  history: {
    pushState: (data: any, unused: string, url?: string | URL | null | undefined) => void;
  };
  addEventListener: (eventName: 'popstate', listener: () => void) => void;
}

export type RouterFactoryParams<T extends Record<string, Route<any>>> = {
  window: WindowType;
  routes: T;
  InvalidPath: React.FC;
  homePath?: keyof T;
};

export const route: RouteFactory = (id) => id;

function decomposeRoute<T extends Routes>(routes: T, path: string): [keyof T, T[keyof T]['params']] {
  const decodedPath = decodeURI(path);
  const [fullRoute, paramsStr] = decodedPath.split('?');
  const route = fullRoute.replace(/^https?:\/\/[^\/]+/, '') as keyof T;
  const routeData = routes[route];
  const routeParams: Record<string, string> = {};
  if (routeData && routeData.params) {
    const routeParamNames = Object.keys(routeData);
    paramsStr
      .split('&')
      .filter((str) => str !== '')
      .forEach((str) => {
        if (!/=/.test(str)) return;
        const [key, val] = str.split('=');
        if (routeParamNames.includes(key)) routeParams[key] = decodeURIComponent(val);
      });
  }
  return [route, routeParams];
}

function composeRoute<T extends Routes, R extends keyof T>(routes: T, route: R, params: T[R]['params']): string {
  const routeStr = route as string;
  const routeData = routes[route];
  if (!routeData || !routeData.params || !params) return routeStr;
  const paramStr = Object.keys(routeData.params)
    .map((key) => `${key}=${encodeURIComponent((params as Record<string, string>)[key])}`)
    .join('&');
  return routeStr + '?' + paramStr;
}

function selectComponent<T extends Routes, R extends keyof T>(routes: T, InvalidPath: React.FC, route: R): [string, React.FC] {
  const routeData = routes[route];
  if (!routeData) return ['INVALID PATH', InvalidPath];
  return [routeData.name, routeData.component];
}

type RouterReducerAction =
  | { type: 'update-route'; payload: { route: string; params?: Record<string, string> } }
  | { type: 'update-params'; payload: { params: Record<string, string> } }
  | {
      type: 'update-functions';
      payload: {
        updateRoute: (route: string, params?: Record<string, string>) => void;
        updateRouteParams: (params: Record<string, string>) => void;
        stringifyRoute: (route: string, params?: Record<string, string>) => string;
      };
    }
  | { type: 'on-popstate' };

export const routerFactory = <T extends Routes>({
  window,
  routes,
  InvalidPath,
  homePath,
}: RouterFactoryParams<T>): { RouterProvider: React.FC; useRouter: UseRouter<T> } => {
  const defaultParams: Record<string, string> = {};
  const routeParamArrMap = {} as Record<keyof T, string[]>;
  for (const [route, routeData] of Object.entries(routes)) {
    const params = routeData.params;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        defaultParams[key] = value || '';
      }
      routeParamArrMap[route as keyof T] = Object.keys(params);
    }
  }
  const [initialRoute, initialRouteParams] = decomposeRoute(routes, window.location.href);
  const initialParams = { ...defaultParams, ...initialRouteParams };
  const [initialName, initialComponent] = selectComponent(routes, InvalidPath, initialRoute);

  const initialContextState: RouterContextState<T> = {
    route: initialRoute,
    routeParams: initialParams,
    routeName: initialName,
    RouteComponent: initialComponent,
    updateRoute: (_route, _params) => void 0,
    updateRouteParams: (_params) => void 0,
    stringifyRoute: (_route, _params) => '',
  };

  function routerReducer(state: RouterContextState<any>, action: RouterReducerAction): RouterContextState<any> {
    switch (action.type) {
      case 'on-popstate': {
        const [route, routeParams] = decomposeRoute(routes, window.location.href);
        const [routeName, RouteComponent] = selectComponent(routes, InvalidPath, route);
        return { ...state, route, routeParams, routeName, RouteComponent };
      }
      case 'update-route': {
        window.history.pushState({}, '', composeRoute(routes, action.payload.route, action.payload.params));
        const [routeName, RouteComponent] = selectComponent(routes, InvalidPath, action.payload.route);
        return {
          ...state,
          route: action.payload.route,
          routeParams: { ...state.routeParams, ...action.payload.params },
          routeName,
          RouteComponent,
        };
      }
      case 'update-params': {
        window.history.pushState({}, '', composeRoute(routes, state.route as keyof T, action.payload.params));
        const [routeName, RouteComponent] = selectComponent(routes, InvalidPath, state.route as keyof T);
        return { ...state, routeName, RouteComponent, routeParams: { ...state.routeParams, ...action.payload.params } };
      }
      case 'update-functions': {
        // @ts-ignore //TODO: fix typings; don't care about this at this point
        return { ...state, ...action.payload };
      }
      default: {
        return state;
      }
    }
  }

  const RouterContext = createContext<RouterContextState<T>>(initialContextState);
  // @ts-ignore
  const RouterProvider: React.FC = function RouterProvider({ children }) {
    const [state, dispatch] = useReducer(routerReducer, initialContextState);
    useEffect(() => {
      function updateRoute(route: string, params?: Record<string, string>) {
        dispatch({ type: 'update-route', payload: { route, params } });
      }
      function updateRouteParams(params: Record<string, string>) {
        dispatch({ type: 'update-params', payload: { params } });
      }
      function stringifyRoute(route: string, params?: Record<string, string>): string {
        return composeRoute<T, keyof T>(routes, route, params);
      }

      dispatch({
        type: 'update-functions',
        payload: {
          updateRoute,
          updateRouteParams,
          stringifyRoute,
        },
      });
    }, []);
    useEffect(() => {
      if (homePath && state.route === '/') dispatch({ type: 'update-route', payload: { route: homePath as string } });
    }, [state.route]);
    window.addEventListener('popstate', () => {
      dispatch({ type: 'on-popstate' });
    });
    return <RouterContext.Provider value={state}>{children}</RouterContext.Provider>;
  };

  function useRouter() {
    const context = useContext(RouterContext);
    if (context === undefined) {
      throw new Error('useRouter must be used within a RouterProvider');
    }
    return context;
  }

  return { RouterProvider, useRouter };
};
