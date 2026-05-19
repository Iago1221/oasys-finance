import { useCallback, useEffect, useRef, useState } from 'react';
import { useFinanceApi } from '../context/AuthContext';

export function useApiQuery<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const api = useFinanceApi();
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Falha ao carregar dados');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api, ...deps]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcherRef.current();
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error('Falha ao carregar dados'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { data, isLoading, error, refetch: load, setData };
}
