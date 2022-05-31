import { useRef } from 'react';
import { useBooleanState } from './useBooleanState';
import { useOnClickOutside } from './useOnClickOutside';

export function useHideOnClickOutside(showInitially = false) {
  const [shouldShow, show, hide] = useBooleanState(showInitially);
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, hide);
  return { shouldShow, show, hide, ref };
}
