import * as React from 'react';
import { useRouter } from '../../router';

export const Content: React.FC<{ className?: string }> = function Content({ className = '' }) {
  const { RouteComponent, routeParams } = useRouter();
  return (
    <div className={'' + ' ' + className}>
      <RouteComponent {...routeParams} />
    </div>
  );
};
