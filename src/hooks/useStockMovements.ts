import { useCallback, useState } from 'react';
import { MOCK_STOCK_MOVEMENTS } from '../data/mock/inventory';
import type { InventoryMovementDetail } from '../types/inventory';

/** Lista detalhada de movimentações de estoque. */
export function useStockMovements() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [movements, setMovements] = useState<InventoryMovementDetail[]>(MOCK_STOCK_MOVEMENTS);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setMovements(MOCK_STOCK_MOVEMENTS);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar movimentações'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { movements, setMovements, isLoading, error, refetch };
}
