import { useCallback, useState } from 'react';
import { MOCK_INVENTORY_RECENT, MOCK_LOW_STOCK_ALERTS } from '../data/mock/inventory';
import type { InventoryMovementSummary, LowStockAlert } from '../types/inventory';

/** Painel principal de estoque (alertas + movimentações recentes). */
export function useInventoryMonitor() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>(MOCK_LOW_STOCK_ALERTS);
  const [recentMovements, setRecentMovements] = useState<InventoryMovementSummary[]>(
    MOCK_INVENTORY_RECENT,
  );

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // await api.inventory.dashboard()
      setLowStockAlerts(MOCK_LOW_STOCK_ALERTS);
      setRecentMovements(MOCK_INVENTORY_RECENT);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar estoque'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    lowStockAlerts,
    recentMovements,
    setLowStockAlerts,
    setRecentMovements,
    isLoading,
    error,
    refetch,
  };
}
