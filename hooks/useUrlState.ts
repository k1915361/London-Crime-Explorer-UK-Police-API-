import { useState, useEffect, useCallback } from 'react';

export function useUrlState<T extends string>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Initialize state from URL or fallback to initialValue
  const [state, setState] = useState<T>(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(key);
    return (value as T) || initialValue;
  });

  // Update URL when state changes
  const setUrlState = useCallback(
    (newValue: T) => {
      setState(newValue);
      const url = new URL(window.location.href);
      if (newValue) {
        url.searchParams.set(key, newValue);
      } else {
        url.searchParams.delete(key);
      }
      window.history.pushState({}, '', url.toString());
    },
    [key]
  );

  // Listen to popstate events (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const value = params.get(key);
      setState((value as T) || initialValue);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key, initialValue]);

  return [state, setUrlState];
}
