import { useMemo } from 'react';
import { useFinanceApi } from '../context/AuthContext';
import { mapPedidoRecenteToHistory } from '../lib/mappers';
import { useApiQuery } from './useApiQuery';

export function useSalesHistory() {
  const api = useFinanceApi();
  const query = useApiQuery(() => api.getVendaPedidosRecentes(), []);

  const orders = useMemo(
    () => (query.data ?? []).map(mapPedidoRecenteToHistory),
    [query.data],
  );

  return {
    orders,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
