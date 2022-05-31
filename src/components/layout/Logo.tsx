import * as React from 'react';

export const Logo: React.FC<{ className?: string }> = function Logo({ className = '' }) {
  return <div className={'flex items-center justify-center text-6xl' + className}>{'\u2b88'}</div>;
};
