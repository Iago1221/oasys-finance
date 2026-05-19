import { useMemo } from 'react';
import { useDepositoContext } from '../context/DepositoContext';
import { useFinanceApi } from '../context/AuthContext';
import {
  mapMovimentacaoEstoqueToSummary,
  mapProdutoSaldoToLowStockAlert,
} from '../lib/mappers';
import type { InventoryMovementSummary, LowStockAlert } from '../types/inventory';
import { useApiQuery } from './useApiQuery';

export function useInventoryMonitor() {
  const api = useFinanceApi();
  const { selectedDepositoId } = useDepositoContext();

  const movQuery = useApiQuery(
    () => {
      if (selectedDepositoId == null) {
        return Promise.resolve([]);
      }
      return api.getEstoqueMovimentacoesRecentes(selectedDepositoId);
    },
    [selectedDepositoId],
  );

  const saldoQuery = useApiQuery(
    () => {
      if (selectedDepositoId == null) {
        return Promise.resolve([]);
      }
      return api.getEstoqueProdutosSaldo(selectedDepositoId);
    },
    [selectedDepositoId],
  );

  const itensQuery = useApiQuery(() => api.getEstoqueItensAtivos(), []);

  const recentMovements: InventoryMovementSummary[] = useMemo(
    () => (movQuery.data ?? []).map(mapMovimentacaoEstoqueToSummary),
    [movQuery.data],
  );

  const lowStockAlerts: LowStockAlert[] = useMemo(
    () =>
      (saldoQuery.data ?? [])
        .map((p, i) => mapProdutoSaldoToLowStockAlert(p, i))
        .filter((a): a is LowStockAlert => a != null),
    [saldoQuery.data],
  );

  const activeItemsCount = itensQuery.data?.length ?? 0;

  const isLoading = movQuery.isLoading || saldoQuery.isLoading || itensQuery.isLoading;
  const error = movQuery.error ?? saldoQuery.error ?? itensQuery.error;

  const refetch = async () => {
    await Promise.all([movQuery.refetch(), saldoQuery.refetch(), itensQuery.refetch()]);
  };

  return {
    lowStockAlerts,
    recentMovements,
    activeItemsCount,
    isLoading,
    error,
    refetch,
  };
}
