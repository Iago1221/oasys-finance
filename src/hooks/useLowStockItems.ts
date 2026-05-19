import { useMemo } from 'react';
import { useDepositoContext } from '../context/DepositoContext';
import { useFinanceApi } from '../context/AuthContext';
import { mapProdutoSaldoToLowStockFull } from '../lib/mappers';
import type { LowStockAlertFull } from '../types/inventory';
import { useApiQuery } from './useApiQuery';

export function useLowStockItems() {
  const api = useFinanceApi();
  const { selectedDepositoId } = useDepositoContext();

  const query = useApiQuery(
    () => {
      if (selectedDepositoId == null) {
        return Promise.resolve([]);
      }
      return api.getEstoqueProdutosSaldo(selectedDepositoId);
    },
    [selectedDepositoId],
  );

  const items: LowStockAlertFull[] = useMemo(
    () =>
      (query.data ?? [])
        .map((p, i) => mapProdutoSaldoToLowStockFull(p, i))
        .filter((a): a is LowStockAlertFull => a != null),
    [query.data],
  );

  return {
    items,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
