import { useCallback, useState } from 'react';
import { MOCK_LOW_STOCK_FULL } from '../data/mock/inventory';
import type { LowStockAlertFull } from '../types/inventory';

/** Itens em alerta de estoque baixo. */
export function useLowStockItems() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<LowStockAlertFull[]>(MOCK_LOW_STOCK_FULL);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(MOCK_LOW_STOCK_FULL);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar alertas'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { items, setItems, isLoading, error, refetch };
}
