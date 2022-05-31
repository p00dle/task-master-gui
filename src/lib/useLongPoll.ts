import { useState, useEffect } from 'react';

export function useLongPoll<T>(path: string, initialData: T, shouldPoll = true): T {
  const [state, setState] = useState(initialData);
  let lastUpdated: number | null = null;
  let controller: AbortController | null = null;

  let wasAborted = false;
  useEffect(() => {
    async function poll() {
      const url = new URL(path, window.location.origin);
      if (lastUpdated) {
        url.searchParams.append('last-updated', '' + lastUpdated);
      }
      controller = new AbortController();
      try {
        const response = await fetch(url.toString(), { signal: controller.signal });
        const json = await response.json();
        lastUpdated = typeof json.lastUpdated === 'number' ? json.lastUpdated : null;
        setState(json.data);
        if (shouldPoll) poll();
      } catch (err) {
        if (!wasAborted) {
          console.error(err);
        }
      }
    }
    if (shouldPoll) poll();
    return () => {
      if (controller) {
        wasAborted = true;
        controller.abort();
      }
    };
  }, [path, shouldPoll]);
  if (!shouldPoll && controller !== null) {
    wasAborted = true;
    (controller as AbortController).abort();
  }
  return state;
}
