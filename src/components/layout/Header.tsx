import * as React from 'react';
import { useRouter } from '../../router';
import { DarkModeSwitcher } from './DarkModeSwitcher';

export const Header: React.FC<{ className?: string }> = function Header({ className = '' }) {
  const { routeName } = useRouter();
  return (
    <header className={'flex items-center space-x-4' + className}>
      <div className="text-2xl grow">{routeName}</div>
      <DarkModeSwitcher />
    </header>
  );
};
