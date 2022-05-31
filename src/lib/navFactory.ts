import { Route, Routes } from './router';

export type NavItem<T extends Routes, R extends keyof T> = {
  name: string;
  subMenu?: NavItem<T, keyof T>[];
  route?: R;
  routeParams?: T[R] extends Route<infer P> ? P : void;
};

export type NavItemFactory = <T extends Routes>() => (navItem: NavItem<T, keyof T>) => NavItem<T, keyof T>;

export type Navigation<T extends Routes> = NavItem<T, keyof T>[];

export const navFactory: NavItemFactory =
  <T extends Routes>() =>
  (navItem: NavItem<T, keyof T>) =>
    navItem;
