import { useCallback, useState } from 'react';
import { MOCK_SALES_HISTORY_ORDERS } from '../data/mock/sales';
import type { SalesHistoryOrder } from '../types/sales';

/** Histórico de pedidos / vendas. */
export function useSalesHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [orders, setOrders] = useState<SalesHistoryOrder[]>(MOCK_SALES_HISTORY_ORDERS);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setOrders(MOCK_SALES_HISTORY_ORDERS);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar histórico'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { orders, setOrders, isLoading, error, refetch };
}
